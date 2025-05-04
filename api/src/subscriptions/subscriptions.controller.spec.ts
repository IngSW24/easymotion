import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";
import { PrismaService } from "nestjs-prisma";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Role } from "@prisma/client";
import { UserSubscriptionDto } from "./dto/subscription.dto";
import { toPaginatedOutput } from "src/common/prisma/pagination";

describe("SubscriptionsController", () => {
  let controller: SubscriptionsController;

  const subscriptionServiceMockup = {
    getCustomerSubscriptions: jest.fn(),
    subscribeFinalUser: jest.fn(),
    unsubscribeFinalUser: jest.fn(),
    getCourseSubscriptions: jest.fn(),
  };

  const prismaServiceMockup = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: subscriptionServiceMockup,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMockup,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should get customer subscriptions", async () => {
    const pagination = { page: 1, perPage: 10 };
    const userId = randomUUID();

    subscriptionServiceMockup.getCustomerSubscriptions.mockResolvedValue({
      data: [{ id: "1" }, { id: "2" }],
      meta: {
        items: pagination.perPage,
        hasNextPage: false,
        currentPage: pagination.page,
        totalItems: 9,
        totalPages: 1,
      },
    });

    const result = await controller.getSubscriptionsForGivenUser(
      userId,
      pagination
    );

    expect(
      subscriptionServiceMockup.getCustomerSubscriptions
    ).toHaveBeenCalledWith(userId, pagination);

    expect(result).toEqual({
      data: [{ id: "1" }, { id: "2" }],
      meta: {
        items: pagination.perPage,
        hasNextPage: false,
        currentPage: pagination.page,
        totalItems: 9,
        totalPages: 1,
      },
    });
  });

  it("should get customer subscriptions of logged user", async () => {
    const req = { user: { sub: "1" } };
    const pagination = { page: 1, perPage: 10 };

    subscriptionServiceMockup.getCustomerSubscriptions.mockResolvedValue({
      data: [{ id: "1" }, { id: "2" }],
      meta: {
        items: pagination.perPage,
        hasNextPage: false,
        currentPage: pagination.page,
        totalItems: 9,
        totalPages: 1,
      },
    });

    const result = await controller.getSubscriptionsForLoggedUser(
      pagination,
      req
    );

    expect(
      subscriptionServiceMockup.getCustomerSubscriptions
    ).toHaveBeenCalledWith(req.user.sub, pagination);

    expect(result).toEqual({
      data: [{ id: "1" }, { id: "2" }],
      meta: {
        items: pagination.perPage,
        hasNextPage: false,
        currentPage: pagination.page,
        totalItems: 9,
        totalPages: 1,
      },
    });
  });

  it("should subscribe a final user to a course", async () => {
    const req = { user: { sub: "1", role: Role.USER } };
    const courseId = randomUUID();
    const subscriptionDate = new Date();
    const subscribeDto = { courseId, userId: "ignored", subscriptionDate };

    const result = await controller.subscribeLoggedUser(subscribeDto, req);

    subscriptionServiceMockup.subscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.subscribeFinalUser).toHaveBeenCalledWith(
      req.user.sub,
      subscribeDto,
      false
    );

    expect(result).toBeUndefined();
  });

  it("should throw bad request is admin attemps subscribe without userId", async () => {
    const courseId = randomUUID();
    const subscriptionDate = new Date();
    const subscribeDto = { courseId, subscriptionDate };

    subscriptionServiceMockup.subscribeFinalUser.mockRejectedValue(() => {
      throw new BadRequestException("User not found");
    });

    expect(async () => {
      await controller.subscribeGivenUser(subscribeDto);
    }).rejects.toThrow(BadRequestException);
  });

  it("should throw bad request is high level priviledged user attempts to subscribe an non customer", async () => {
    const courseId = randomUUID();
    const subscriptionDate = new Date();
    const subscribeDto = { courseId, subscriptionDate };

    subscriptionServiceMockup.subscribeFinalUser.mockRejectedValue(() => {
      throw new BadRequestException("User not found");
    });

    expect(async () => {
      await controller.subscribeGivenUser(subscribeDto);
    }).rejects.toThrow(BadRequestException);
  });

  it("should throw not found exception when user is not found on subscribe", async () => {
    const req = { user: { sub: "1", role: Role.USER } };
    const courseId = "1";
    const subscribeDto = { courseId };

    subscriptionServiceMockup.subscribeFinalUser.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(controller.subscribeLoggedUser(subscribeDto, req)).rejects.toThrow(
      NotFoundException
    );
  });

  it("should unsubscribe a final user from a course", async () => {
    const req = { user: { sub: "1", role: Role.USER } };
    const deleteDto = { courseId: "1", userId: "ignored" };

    const result = await controller.unsubscribeLoggedUser(deleteDto, req);

    subscriptionServiceMockup.unsubscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.unsubscribeFinalUser).toHaveBeenCalledWith(
      req.user.sub,
      deleteDto
    );

    expect(result).toBeUndefined();
  });

  it("should unsubscribe the given final user from a course if admin", async () => {
    const userId = randomUUID();
    const deleteDto = { courseId: "1", userId };

    const result = await controller.unsubscribeGivenUser(deleteDto);

    subscriptionServiceMockup.unsubscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.unsubscribeFinalUser).toHaveBeenCalledWith(
      userId,
      deleteDto
    );

    expect(result).toBeUndefined();
  });

  it("should unsubscribe the given final user from a course if physiotherapist", async () => {
    const userId = randomUUID();
    const deleteDto = { courseId: "1", userId };

    const result = await controller.unsubscribeGivenUser(deleteDto);

    subscriptionServiceMockup.unsubscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.unsubscribeFinalUser).toHaveBeenCalledWith(
      userId,
      deleteDto
    );

    expect(result).toBeUndefined();
  });

  it("should throw exception if admin attempts to unsubscribe without userId", async () => {
    const deleteDto = { courseId: "1" };

    subscriptionServiceMockup.unsubscribeFinalUser.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(async () => {
      await controller.unsubscribeGivenUser(deleteDto);
    }).rejects.toThrow(NotFoundException);
  });

  it("should throw not found exception when user is not found on unsubscribe", async () => {
    const deleteDto = { courseId: "1", userId: randomUUID() };

    subscriptionServiceMockup.unsubscribeFinalUser.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(controller.unsubscribeGivenUser(deleteDto)).rejects.toThrow(
      NotFoundException
    );
  });

  it("should get the list of subscriptions for a course", async () => {
    const subscribers: UserSubscriptionDto[] = [
      {
        course: null,
        user: {
          id: "1",
          email: "email@email.email",
          firstName: "a",
          lastName: "b",
          middleName: "c",
        },

        subscriptionDate: new Date(),
      },
    ];

    const output = toPaginatedOutput(subscribers, 1, { page: 1, perPage: 10 });

    subscriptionServiceMockup.getCourseSubscriptions.mockResolvedValue(output);

    const result = await controller.getSubscribers("1", {
      page: 1,
      perPage: 10,
    });

    expect(result).toEqual(output);

    expect(
      subscriptionServiceMockup.getCourseSubscriptions
    ).toHaveBeenCalledWith("1", { page: 1, perPage: 10 });
  });
});
