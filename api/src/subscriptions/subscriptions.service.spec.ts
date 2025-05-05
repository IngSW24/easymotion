import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsService } from "./subscriptions.service";
import { PrismaService } from "nestjs-prisma";
import { BadRequestException } from "@nestjs/common";
import { Course, PaymentRecurrence, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { applicationUserDtoMock } from "test/mocks/users.mock";

describe("SubscriptionsService", () => {
  let service: SubscriptionsService;

  const prismaMock = {
    subscription: {
      count: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    course: {
      findUniqueOrThrow: jest.fn(),
      findUnique: jest.fn(),
    },
    patient: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  };

  const createDirectSubscriptionSpy = jest.fn().mockResolvedValue({});

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);

    service.createDirectSubscription = createDirectSubscriptionSpy;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getCustomerSubscriptions", () => {
    it("should get customer subscriptions", async () => {
      const userId = "1";
      const pagination = { page: 1, perPage: 10 };
      const isPending = false;

      const [uuidCourse, uuidUser1, uuidUser2] = [
        randomUUID(),
        randomUUID(),
        randomUUID(),
      ];

      const course: Course = {
        name: "Course name",
        id: uuidCourse,
        description: "Course desc",
        short_description: "short desc",
        location: "LOCATION1",
        instructors: ["A", "B"],
        image_path: "",
        level: "BASIC",
        price: new Prisma.Decimal("30"),
        payment_recurrence: PaymentRecurrence.SINGLE,
        is_published: true,
        subscriptions_open: true,
        max_subscribers: 10,
        tags: ["TAG1", "TAG2"],
        created_at: new Date(),
        updated_at: new Date(),
        owner_id: "1",
        category_id: "1",
        subscription_start_date: new Date(),
        subscription_end_date: new Date(),
      };

      const courseSubscribers = [
        {
          course: course,
          created_at: new Date(),
          updated_at: new Date(),
          course_id: uuidCourse,
          patient_id: uuidUser1,
          isPending: false,
          subscriptionRequestMessage: "Message 1",
        },
        {
          course: course,
          created_at: new Date(),
          updated_at: new Date(),
          course_id: uuidCourse,
          patient_id: uuidUser2,
          isPending: false,
          subscriptionRequestMessage: "Message 2",
        },
      ];

      prismaMock.subscription.count.mockResolvedValue(2);
      prismaMock.subscription.findMany.mockResolvedValue(courseSubscribers);

      const result = await service.getCustomerSubscriptions(
        userId,
        pagination,
        isPending
      );

      expect(prismaMock.subscription.count).toHaveBeenCalledWith({
        where: { patient_id: userId, isPending },
      });

      expect(prismaMock.subscription.findMany).toHaveBeenCalledWith({
        where: { patient_id: userId, isPending },
        include: {
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { course: { name: "asc" } },
        skip: pagination.page * pagination.perPage,
        take: pagination.perPage,
      });

      expect(result.data.length).toBe(2);
      expect(result.meta.totalItems).toBe(2);
    });

    it("should get pending subscriptions", async () => {
      const userId = "1";
      const pagination = { page: 1, perPage: 10 };
      const isPending = true;

      prismaMock.subscription.count.mockResolvedValue(1);
      prismaMock.subscription.findMany.mockResolvedValue([
        {
          course: {
            id: "course-1",
            name: "Pending Course",
          },
          created_at: new Date(),
          updated_at: new Date(),
          course_id: "course-1",
          patient_id: userId,
          isPending: true,
          subscriptionRequestMessage: "Please approve",
        },
      ]);

      const result = await service.getCustomerSubscriptions(
        userId,
        pagination,
        isPending
      );

      expect(prismaMock.subscription.count).toHaveBeenCalledWith({
        where: { patient_id: userId, isPending },
      });

      expect(prismaMock.subscription.findMany).toHaveBeenCalledWith({
        where: { patient_id: userId, isPending },
        include: {
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { course: { name: "asc" } },
        skip: pagination.page * pagination.perPage,
        take: pagination.perPage,
      });

      expect(result.data.length).toBe(1);
      expect(result.meta.totalItems).toBe(1);
    });
  });

  describe("createSubscriptionRequest", () => {
    it("should create a subscription request", async () => {
      const patientId = "patient-1";
      const courseId = "course-1";

      const course = {
        id: courseId,
        subscription_start_date: new Date(),
        subscription_end_date: new Date(new Date().getTime() + 86400000),
        max_subscribers: 10,
        subscriptions_open: true,
      };

      const patient = {
        applicationUserId: patientId,
      };

      prismaMock.course.findUniqueOrThrow.mockResolvedValue(course);
      prismaMock.patient.findUniqueOrThrow.mockResolvedValue(patient);
      prismaMock.subscription.count.mockResolvedValue(5); // 5 < 10 max subscribers

      await service.createSubscriptionRequest(patientId, courseId);

      expect(prismaMock.subscription.create).toHaveBeenCalledWith({
        data: {
          course_id: courseId,
          patient_id: patientId,
          isPending: true,
        },
      });
    });

    it("should throw BadRequestException when course is closed for subscriptions", async () => {
      const patientId = "patient-1";
      const courseId = "course-1";

      const course = {
        id: courseId,
        subscription_start_date: new Date(),
        subscription_end_date: new Date(new Date().getTime() + 86400000),
        max_subscribers: 10,
        subscriptions_open: false,
      };

      prismaMock.course.findUniqueOrThrow.mockResolvedValue(course);

      await expect(
        service.createSubscriptionRequest(patientId, courseId)
      ).rejects.toThrow(BadRequestException);

      expect(createDirectSubscriptionSpy).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException when course is full", async () => {
      const patientId = "patient-1";
      const courseId = "course-1";

      const course = {
        id: courseId,
        subscription_start_date: new Date(),
        subscription_end_date: new Date(new Date().getTime() + 86400000),
        max_subscribers: 10,
        subscriptions_open: true,
      };

      prismaMock.course.findUniqueOrThrow.mockResolvedValue(course);
      prismaMock.subscription.count.mockResolvedValue(10); // 10 = 10 max subscribers

      await expect(
        service.createSubscriptionRequest(patientId, courseId)
      ).rejects.toThrow(BadRequestException);

      expect(createDirectSubscriptionSpy).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException when subscription period is over", async () => {
      const patientId = "patient-1";
      const courseId = "course-1";

      const course = {
        id: courseId,
        subscription_start_date: new Date(new Date().getTime() - 86400000 * 2), // 2 days ago
        subscription_end_date: new Date(new Date().getTime() - 86400000),
        max_subscribers: 10,
        subscriptions_open: true,
      };

      prismaMock.course.findUniqueOrThrow.mockResolvedValue(course);

      await expect(
        service.createSubscriptionRequest(patientId, courseId)
      ).rejects.toThrow(BadRequestException);

      expect(createDirectSubscriptionSpy).not.toHaveBeenCalled();
    });
  });

  describe("createDirectSubscription", () => {
    it("should create a direct subscription", async () => {
      service.createDirectSubscription =
        SubscriptionsService.prototype.createDirectSubscription;

      const patientId = "patient-1";
      const courseId = "course-1";

      const patient = {
        applicationUserId: patientId,
      };

      const course = {
        id: courseId,
      };

      prismaMock.patient.findUniqueOrThrow.mockResolvedValue(patient);
      prismaMock.course.findUniqueOrThrow.mockResolvedValue(course);

      prismaMock.subscription.upsert.mockImplementation((args) => {
        return Promise.resolve({
          course_id: args.create.course_id,
          patient_id: args.create.patient_id,
          isPending: args.create.isPending,
        });
      });

      await service.createDirectSubscription(patientId, courseId);

      expect(prismaMock.subscription.upsert).toHaveBeenCalledWith({
        create: {
          course_id: courseId,
          patient_id: patientId,
          isPending: false,
        },
        update: {
          isPending: false,
        },
        where: {
          course_id_patient_id: {
            course_id: courseId,
            patient_id: patientId,
          },
        },
      });
    });
  });

  describe("acceptSubscriptionRequest", () => {
    it("should accept a subscription request", async () => {
      const patientId = "patient-1";
      const courseId = "course-1";

      // Mock findUnique instead of findUniqueOrThrow since that's what the service uses
      prismaMock.subscription.findUnique.mockResolvedValue({
        isPending: true,
        patient_id: patientId,
        course_id: courseId,
      });

      await service.acceptSubscriptionRequest(patientId, courseId);

      expect(prismaMock.subscription.findUnique).toHaveBeenCalledWith({
        where: {
          course_id_patient_id: {
            course_id: courseId,
            patient_id: patientId,
          },
        },
      });

      expect(prismaMock.subscription.update).toHaveBeenCalledWith({
        where: {
          course_id_patient_id: {
            course_id: courseId,
            patient_id: patientId,
          },
        },
        data: {
          isPending: false,
        },
      });
    });

    it("should throw BadRequestException when subscription request doesn't exist", async () => {
      const patientId = "patient-1";
      const courseId = "course-1";

      // This is returning null, causing BadRequestException
      prismaMock.subscription.findUnique.mockResolvedValue(null);

      await expect(
        service.acceptSubscriptionRequest(patientId, courseId)
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.subscription.update).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException when subscription is not pending", async () => {
      const patientId = "patient-1";
      const courseId = "course-1";

      prismaMock.subscription.findUnique.mockResolvedValue({
        isPending: false, // already accepted
        patient_id: patientId,
        course_id: courseId,
      });

      await expect(
        service.acceptSubscriptionRequest(patientId, courseId)
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.subscription.update).not.toHaveBeenCalled();
    });
  });

  describe("unsubscribeFinalUser", () => {
    it("should unsubscribe a user from a course", async () => {
      const patientId = "patient-1";
      const courseId = "course-1";

      await service.unsubscribeFinalUser(patientId, courseId);

      expect(prismaMock.subscription.deleteMany).toHaveBeenCalledWith({
        where: {
          course_id: courseId,
          patient_id: patientId,
        },
      });
    });
  });

  describe("getCourseSubscriptions", () => {
    it("should retrieve subscriptions for a course", async () => {
      const courseId = "course-1";
      const pagination = { page: 1, perPage: 10 };
      const isPending = false;

      const userMock = applicationUserDtoMock();

      // Update count to include isPending in the where clause
      prismaMock.subscription.count.mockResolvedValue(1);
      prismaMock.subscription.findMany.mockResolvedValue([
        {
          course_id: courseId,
          patient_id: userMock.id,
          created_at: new Date(),
          updated_at: new Date(),
          isPending: false,
          subscriptionRequestMessage: "Hello",
          patient: {
            applicationUser: {
              ...userMock,
            },
          },
          course: {
            id: courseId,
            name: "Test Course",
          },
        },
      ]);

      const result = await service.getCourseSubscriptions(
        pagination,
        courseId,
        isPending
      );

      expect(prismaMock.subscription.count).toHaveBeenCalledWith({
        where: { course_id: courseId, isPending },
      });

      expect(prismaMock.subscription.findMany).toHaveBeenCalledWith({
        where: { course_id: courseId, isPending },
        include: {
          patient: { include: { applicationUser: true } },
          course: { select: { id: true, name: true } },
        },
        orderBy: { patient: { applicationUser: { firstName: "asc" } } },
        skip: pagination.page * pagination.perPage,
        take: pagination.perPage,
      });

      expect(result.data.length).toBe(1);
      expect(result.meta.totalItems).toBe(1);
    });

    it("should retrieve pending subscriptions for a course", async () => {
      const courseId = "course-1";
      const pagination = { page: 1, perPage: 10 };
      const isPending = true;

      prismaMock.subscription.count.mockResolvedValue(2);
      prismaMock.subscription.findMany.mockResolvedValue([
        {
          course_id: courseId,
          patient_id: "user-1",
          created_at: new Date(),
          updated_at: new Date(),
          isPending: true,
          subscriptionRequestMessage: "Request 1",
          patient: {
            applicationUser: {
              id: "user-1",
              email: "user1@example.com",
              firstName: "User",
              lastName: "One",
              middleName: null,
            },
          },
          course: {
            id: courseId,
            name: "Test Course",
          },
        },
        {
          course_id: courseId,
          patient_id: "user-2",
          created_at: new Date(),
          updated_at: new Date(),
          isPending: true,
          subscriptionRequestMessage: "Request 2",
          patient: {
            applicationUser: {
              id: "user-2",
              email: "user2@example.com",
              firstName: "User",
              lastName: "Two",
              middleName: null,
            },
          },
          course: {
            id: courseId,
            name: "Test Course",
          },
        },
      ]);

      const result = await service.getCourseSubscriptions(
        pagination,
        courseId,
        isPending
      );

      // Update expectations to include isPending in where clause
      expect(prismaMock.subscription.count).toHaveBeenCalledWith({
        where: { course_id: courseId, isPending },
      });

      expect(result.data.length).toBe(2);
      expect(result.meta.totalItems).toBe(2);
    });
  });
});
