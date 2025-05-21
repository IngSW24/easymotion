import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";
import { BadRequestException } from "@nestjs/common";
import {
  SubscriptionCreateDto,
  SubscriptionRequestDto,
} from "./dto/subscription-create.dto";
import { SubscriptionDeleteDto } from "./dto/subscription-delete.dto";
import { EmailService } from "src/email/email.service";
import { CoursesService } from "src/courses/courses.service";
import { UserManager } from "src/users/user.manager";

describe("SubscriptionsController", () => {
  let controller: SubscriptionsController;

  const subscriptionServiceMockup = {
    getCustomerSubscriptions: jest.fn(),
    createSubscriptionRequest: jest.fn(),
    createDirectSubscription: jest.fn(),
    unsubscribeFinalUser: jest.fn(),
    getCourseSubscriptions: jest.fn(),
    acceptSubscriptionRequest: jest.fn(),
  };

  const emailServiceMockup = {
    sendEmail: jest.fn().mockResolvedValue(undefined),
  };

  const coursesServiceMockup = {
    findOne: jest.fn().mockResolvedValue({
      id: "course-id",
      name: "Test Course",
      owner: {
        email: "owner@example.com",
      },
    }),
  };

  const userManagerMockup = {
    getUserById: jest.fn().mockResolvedValue({
      id: "user-id",
      email: "user@example.com",
      firstName: "Test",
      lastName: "User",
      patient: {
        userId: "user-id",
      },
      physiotherapist: null,
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: subscriptionServiceMockup,
        },
        {
          provide: EmailService,
          useValue: emailServiceMockup,
        },
        {
          provide: CoursesService,
          useValue: coursesServiceMockup,
        },
        {
          provide: UserManager,
          useValue: userManagerMockup,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("User Endpoints", () => {
    it("should get active subscriptions for logged user", async () => {
      const req = { user: { sub: "1" } };
      const pagination = { page: 1, perPage: 10 };
      const expectedResult = {
        data: [{ id: "1", course: { id: "course-1", name: "Course 1" } }],
        meta: {
          items: pagination.perPage,
          hasNextPage: false,
          currentPage: pagination.page,
          totalItems: 1,
          totalPages: 1,
        },
      };

      subscriptionServiceMockup.getCustomerSubscriptions.mockResolvedValue(
        expectedResult
      );

      const result = await controller.getSubscriptionsForLoggedUser(
        pagination,
        req
      );

      expect(
        subscriptionServiceMockup.getCustomerSubscriptions
      ).toHaveBeenCalledWith(req.user.sub, pagination, false);
      expect(result).toEqual(expectedResult);
    });

    it("should get pending subscriptions for logged user", async () => {
      const req = { user: { sub: "1" } };
      const pagination = { page: 1, perPage: 10 };
      const expectedResult = {
        data: [{ id: "1", course: { id: "course-1", name: "Course 1" } }],
        meta: {
          items: pagination.perPage,
          hasNextPage: false,
          currentPage: pagination.page,
          totalItems: 1,
          totalPages: 1,
        },
      };

      subscriptionServiceMockup.getCustomerSubscriptions.mockResolvedValue(
        expectedResult
      );

      const result = await controller.getPendingSubscriptionsForLoggedUser(
        pagination,
        req
      );

      expect(
        subscriptionServiceMockup.getCustomerSubscriptions
      ).toHaveBeenCalledWith(req.user.sub, pagination, true);
      expect(result).toEqual(expectedResult);
    });

    it("should send subscription request", async () => {
      const req = { user: { sub: "1" } };
      const subscriptionRequestDto: SubscriptionRequestDto = {
        courseId: "course-1",
        subscriptionRequestMessage: "",
      };

      await controller.sendSubscriptionRequest(subscriptionRequestDto, req);

      expect(
        subscriptionServiceMockup.createSubscriptionRequest
      ).toHaveBeenCalledWith(req.user.sub, subscriptionRequestDto.courseId);
    });
  });

  describe("Admin/Physiotherapist Endpoints", () => {
    it("should get active subscriptions for a given user", async () => {
      const userId = "user-1";
      const pagination = { page: 1, perPage: 10 };
      const expectedResult = {
        data: [{ id: "1", course: { id: "course-1", name: "Course 1" } }],
        meta: {
          items: pagination.perPage,
          hasNextPage: false,
          currentPage: pagination.page,
          totalItems: 1,
          totalPages: 1,
        },
      };

      subscriptionServiceMockup.getCustomerSubscriptions.mockResolvedValue(
        expectedResult
      );

      const result = await controller.getSubscriptionsForGivenUser(
        userId,
        pagination
      );

      expect(
        subscriptionServiceMockup.getCustomerSubscriptions
      ).toHaveBeenCalledWith(userId, pagination, false);
      expect(result).toEqual(expectedResult);
    });

    it("should get pending subscriptions for a given user", async () => {
      const userId = "user-1";
      const pagination = { page: 1, perPage: 10 };
      const expectedResult = {
        data: [{ id: "1", course: { id: "course-1", name: "Course 1" } }],
        meta: {
          items: pagination.perPage,
          hasNextPage: false,
          currentPage: pagination.page,
          totalItems: 1,
          totalPages: 1,
        },
      };

      subscriptionServiceMockup.getCustomerSubscriptions.mockResolvedValue(
        expectedResult
      );

      const result = await controller.getPendingSubscriptionsForGivenUser(
        userId,
        pagination
      );

      expect(
        subscriptionServiceMockup.getCustomerSubscriptions
      ).toHaveBeenCalledWith(userId, pagination, true);
      expect(result).toEqual(expectedResult);
    });

    it("should get active subscribers for a course", async () => {
      const courseId = "course-1";
      const pagination = { page: 1, perPage: 10 };
      const expectedResult = {
        data: [
          {
            id: "1",
            user: { id: "user-1", firstName: "John", lastName: "Doe" },
          },
        ],
        meta: {
          items: pagination.perPage,
          hasNextPage: false,
          currentPage: pagination.page,
          totalItems: 1,
          totalPages: 1,
        },
      };

      subscriptionServiceMockup.getCourseSubscriptions.mockResolvedValue(
        expectedResult
      );

      const result = await controller.getSubscribersForCourse(
        courseId,
        pagination
      );

      expect(
        subscriptionServiceMockup.getCourseSubscriptions
      ).toHaveBeenCalledWith(pagination, courseId, false);
      expect(result).toEqual(expectedResult);
    });

    it("should get pending subscribers for a course", async () => {
      const courseId = "course-1";
      const pagination = { page: 1, perPage: 10 };
      const expectedResult = {
        data: [
          {
            id: "1",
            user: { id: "user-1", firstName: "John", lastName: "Doe" },
          },
        ],
        meta: {
          items: pagination.perPage,
          hasNextPage: false,
          currentPage: pagination.page,
          totalItems: 1,
          totalPages: 1,
        },
      };

      subscriptionServiceMockup.getCourseSubscriptions.mockResolvedValue(
        expectedResult
      );

      const result = await controller.getPendingSubscribersForCourse(
        courseId,
        pagination
      );

      expect(
        subscriptionServiceMockup.getCourseSubscriptions
      ).toHaveBeenCalledWith(pagination, courseId, true);
      expect(result).toEqual(expectedResult);
    });

    it("should accept subscription request and send email", async () => {
      const subscriptionDto: SubscriptionCreateDto = {
        patientId: "patient-1",
        courseId: "course-1",
      };

      await controller.acceptSubscriptionRequest(subscriptionDto);

      expect(
        subscriptionServiceMockup.acceptSubscriptionRequest
      ).toHaveBeenCalledWith(
        subscriptionDto.patientId,
        subscriptionDto.courseId
      );
      expect(coursesServiceMockup.findOne).toHaveBeenCalledWith(
        subscriptionDto.courseId
      );
      expect(userManagerMockup.getUserById).toHaveBeenCalledWith(
        subscriptionDto.patientId
      );
      expect(emailServiceMockup.sendEmail).toHaveBeenCalledWith(
        "user@example.com",
        "Richiesta di iscrizione accettata",
        expect.any(String)
      );
    });

    it("should create direct subscription and send emails", async () => {
      const subscriptionDto: SubscriptionCreateDto = {
        patientId: "patient-1",
        courseId: "course-1",
      };

      await controller.createSubscription(subscriptionDto);

      expect(
        subscriptionServiceMockup.createDirectSubscription
      ).toHaveBeenCalledWith(
        subscriptionDto.patientId,
        subscriptionDto.courseId
      );
      expect(coursesServiceMockup.findOne).toHaveBeenCalledWith(
        subscriptionDto.courseId
      );
      expect(userManagerMockup.getUserById).toHaveBeenCalledWith(
        subscriptionDto.patientId
      );
      expect(emailServiceMockup.sendEmail).toHaveBeenCalledTimes(2);
      expect(emailServiceMockup.sendEmail).toHaveBeenNthCalledWith(
        1,
        "owner@example.com",
        "Nuova iscrizione al corso",
        expect.any(String)
      );
      expect(emailServiceMockup.sendEmail).toHaveBeenNthCalledWith(
        2,
        "user@example.com",
        "Iscrizione al corso",
        expect.any(String)
      );
    });

    it("should delete subscription and send email", async () => {
      const deleteDto: SubscriptionDeleteDto = {
        patientId: "patient-1",
        courseId: "course-1",
      };

      await controller.deleteSubscription(deleteDto);

      expect(
        subscriptionServiceMockup.unsubscribeFinalUser
      ).toHaveBeenCalledWith(deleteDto.patientId, deleteDto.courseId);
      expect(coursesServiceMockup.findOne).toHaveBeenCalledWith(
        deleteDto.courseId
      );
      expect(userManagerMockup.getUserById).toHaveBeenCalledWith(
        deleteDto.patientId
      );
      expect(emailServiceMockup.sendEmail).toHaveBeenCalledWith(
        "user@example.com",
        "Rimozione dal corso",
        expect.any(String)
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle errors when service throws exceptions", async () => {
      const req = { user: { sub: "1" } };
      const subscriptionRequestDto: SubscriptionRequestDto = {
        courseId: "course-1",
        subscriptionRequestMessage: "",
      };

      subscriptionServiceMockup.createSubscriptionRequest.mockRejectedValue(
        new BadRequestException("Course is full")
      );

      await expect(
        controller.sendSubscriptionRequest(subscriptionRequestDto, req)
      ).rejects.toThrow(BadRequestException);
    });

    it("should not send email if user is not found", async () => {
      const deleteDto: SubscriptionDeleteDto = {
        patientId: "patient-1",
        courseId: "course-1",
      };

      userManagerMockup.getUserById.mockRejectedValueOnce(
        new Error("User not found")
      );

      await expect(controller.deleteSubscription(deleteDto)).rejects.toThrow(
        "User not found"
      );

      expect(
        subscriptionServiceMockup.unsubscribeFinalUser
      ).toHaveBeenCalledWith(deleteDto.patientId, deleteDto.courseId);
      expect(coursesServiceMockup.findOne).toHaveBeenCalledWith(
        deleteDto.courseId
      );
      expect(userManagerMockup.getUserById).toHaveBeenCalledWith(
        deleteDto.patientId
      );
      expect(emailServiceMockup.sendEmail).not.toHaveBeenCalled();
    });
  });
});
