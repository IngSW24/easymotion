import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsService } from "./subscriptions.service";
import { PrismaService } from "nestjs-prisma";
import { toPaginatedOutput } from "src/common/utils/pagination";
import { Course, PaymentRecurrence, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { plainToInstance } from "class-transformer";
import { NotFoundException } from "@nestjs/common";
import { applicationUserDtoMock } from "test/mocks/users.mock";
import { SubscriptionDtoWithCourse } from "./dto/subscription.dto";

describe("SubsriptionsService", () => {
  let service: SubscriptionsService;

  const prismaMock = {
    subscription: {
      count: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    course: {
      findUniqueOrThrow: jest.fn(),
    },
    patient: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
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
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should get customer subcriptions", async () => {
    const userId = "1";
    const pagination = { page: 1, perPage: 10 };

    const [uuidCourse, uuidUser1, uuidUser2] = [
      randomUUID(),
      randomUUID(),
      randomUUID(),
    ];

    const course: Course[] = [
      {
        name: "Course name",
        id: uuidCourse,
        description: "Course desc",
        short_description: "short desc",
        location: "LOCATION1",
        instructors: ["A", "B"],
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
      },
    ];

    const courseSubscribers = [
      {
        course: course[0],
        created_at: new Date(),
        updated_at: new Date(),
        course_id: uuidCourse,
        patient_id: uuidUser1,
      },
      {
        course: course[0],
        created_at: new Date(),
        updated_at: new Date(),
        course_id: uuidCourse,
        patient_id: uuidUser2,
      },
    ];

    prismaMock.subscription.count.mockResolvedValue(2);
    prismaMock.subscription.findMany.mockResolvedValue(courseSubscribers);

    const result = await service.getCustomerSubscriptions(userId, pagination);

    expect(prismaMock.subscription.count).toHaveBeenCalledWith({
      where: { patient_id: userId, isPending: false },
    });

    expect(prismaMock.subscription.findMany).toHaveBeenCalledWith({
      where: { patient_id: userId, isPending: false },
      include: { course: true },
      orderBy: { course: { name: "asc" } },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    const expectedResult = toPaginatedOutput(
      courseSubscribers.map((x) =>
        plainToInstance(
          SubscriptionDtoWithCourse,
          { course: x.course, subscriptionDate: x.created_at },
          { excludeExtraneousValues: true }
        )
      ),
      2,
      pagination
    );

    expect(result).toEqual(expectedResult);
  });

  it("should subscribe a final user to a course", async () => {
    const patient_id = "1";
    const course_id = "2";

    const user = {
      applicationUserId: patient_id,
    };

    const course = {
      id: course_id,
      subscription_start_date: new Date(),
      subscription_end_date: new Date(new Date().getTime() + 60000), // FIXME: add 1 minute (60000 milliseconds)
    };

    prismaMock.patient.findUniqueOrThrow.mockResolvedValue(user);
    prismaMock.course.findUniqueOrThrow.mockResolvedValue(course);
    prismaMock.subscription.count.mockResolvedValue(2);

    await service.subscribeFinalUser(
      patient_id,
      {
        course_id,
        patient_id,
        subscriptionRequestMessage: "MSG1",
      },
      false
    );

    expect(prismaMock.patient.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { applicationUserId: user.applicationUserId },
    });

    expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: course_id },
    });

    expect(prismaMock.subscription.upsert).toHaveBeenCalledWith({
      create: {
        course_id: course_id,
        patient_id: patient_id,
        isPending: false,
      },
      update: {
        isPending: false,
      },
      where: {
        course_id_patient_id: {
          course_id: course_id,
          patient_id: patient_id,
        },
      },
    });
  });

  it("should throw not found exception if final user does not exist", async () => {
    const patient_id = "1";
    const course_id = "2";

    prismaMock.patient.findUniqueOrThrow.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(
      service.subscribeFinalUser(patient_id, {
        course_id,
        patient_id,
        subscriptionRequestMessage: "MSG2",
      })
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.patient.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { applicationUserId: patient_id },
    });
  });

  it("should throw not found exception if attempting to subscribe a physiotherapist", async () => {
    const patient_id = "1";
    const course_id = "2";

    prismaMock.patient.findUnique.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(
      service.subscribeFinalUser(
        patient_id,
        {
          course_id,
          patient_id,
          subscriptionRequestMessage: "MSG3",
        },
        true
      )
    ).rejects.toThrow(NotFoundException);
  });

  it("should throw not found exception if course does not exist", async () => {
    const patient_id = "1";
    const course_id = "2";
    prismaMock.patient.findUnique.mockResolvedValue({ patient_id });
    prismaMock.course.findUniqueOrThrow.mockRejectedValue(() => {
      throw new NotFoundException("Course not found");
    });

    expect(
      service.subscribeFinalUser(patient_id, {
        course_id,
        patient_id,
        subscriptionRequestMessage: "MSG2",
      })
    ).rejects.toThrow(NotFoundException);
  });

  it("should unsubscribe a final user from a course", async () => {
    const patient_id = "1";
    const course_id = "2";

    await service.unsubscribeFinalUser(patient_id, course_id);

    expect(prismaMock.subscription.deleteMany).toHaveBeenCalledWith({
      where: { course_id: course_id, patient_id: patient_id },
    });
  });

  it("should retrieve subscriptions for a course", async () => {
    const course_id = randomUUID();
    const created_at = new Date();
    const updated_at = new Date();
    const pagination = { page: 1, perPage: 10 };

    const userMock = applicationUserDtoMock();

    prismaMock.subscription.count.mockResolvedValue(1);
    prismaMock.subscription.findMany.mockResolvedValue([
      {
        course_id: course_id,
        patient_id: userMock.id,
        created_at,
        updated_at,
        patient: {
          applicationUser: {
            ...userMock,
          },
        },
        course: {
          id: course_id,
          name: "",
        },
      },
    ]);

    const result = await service.getCourseSubscriptions(
      pagination,
      false,
      course_id
    );

    expect(prismaMock.subscription.count).toHaveBeenCalledWith({
      where: { course_id: course_id },
    });

    expect(prismaMock.subscription.findMany).toHaveBeenCalledWith({
      where: { course_id: course_id, isPending: false },
      include: {
        patient: { include: { applicationUser: true } },
        course: { select: { id: true, name: true } },
      },
      orderBy: { patient: { applicationUser: { firstName: "asc" } } },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    const expectedResult = toPaginatedOutput(
      [
        {
          user: {
            id: userMock.id,
            email: userMock.email,
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            middleName: userMock.middleName,
          },
          course: {
            id: course_id,
            name: "",
          },

          created_at,
          updated_at,
          subscriptionRequestMessage: undefined,
        },
      ],
      1,
      pagination
    );

    expect(result).toEqual(expectedResult);
  });
});
