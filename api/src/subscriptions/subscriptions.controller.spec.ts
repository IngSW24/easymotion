import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { toPaginatedOutput } from "src/common/utils/pagination";
import { randomUUID } from "crypto";
import { Role } from "@prisma/client";
import { SubscriptionCreateDto } from "./dto/subscription-create.dto";
import { SubscriptionDeleteDto } from "./dto/subscription-delete.dto";
import { SubscriptionDtoWithUser } from "./dto/subscription.dto";

describe("SubscriptionsController", () => {
  let controller: SubscriptionsController;

  const subscriptionServiceMockup = {
    getCustomerSubscriptions: jest.fn(),
    subscribeFinalUser: jest.fn(),
    unsubscribeFinalUser: jest.fn(),
    getCourseSubscriptions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: subscriptionServiceMockup,
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
    const course_id = randomUUID();
    const subscribeDto: SubscriptionCreateDto = {
      course_id,
      patient_id: "ignored",
      subscriptionRequestMessage: null,
    };

    const result = await controller.subscribeLoggedUser(subscribeDto, req);

    subscriptionServiceMockup.subscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.subscribeFinalUser).toHaveBeenCalledWith(
      req.user.sub,
      subscribeDto,
      true
    );

    expect(result).toBeUndefined();
  });

  it("should throw bad request is admin attemps subscribe without userId", async () => {
    const course_id = randomUUID();
    const subscribeDto: SubscriptionCreateDto = {
      course_id,
      patient_id: null,
      subscriptionRequestMessage: null,
    };

    subscriptionServiceMockup.subscribeFinalUser.mockRejectedValue(() => {
      throw new BadRequestException("User not found");
    });

    expect(async () => {
      await controller.subscribeGivenUser(subscribeDto);
    }).rejects.toThrow(BadRequestException);
  });

  it("should throw bad request is high level priviledged user attempts to subscribe an non customer", async () => {
    const course_id = randomUUID();
    const subscribeDto: SubscriptionCreateDto = {
      course_id,
      patient_id: null,
      subscriptionRequestMessage: null,
    };

    subscriptionServiceMockup.subscribeFinalUser.mockRejectedValue(() => {
      throw new BadRequestException("User not found");
    });

    expect(async () => {
      await controller.subscribeGivenUser(subscribeDto);
    }).rejects.toThrow(BadRequestException);
  });

  it("should throw not found exception when user is not found on subscribe", async () => {
    const req = { user: { sub: randomUUID(), role: Role.USER } };
    const course_id = randomUUID();
    const subscribeDto: SubscriptionCreateDto = {
      course_id,
      patient_id: null,
      subscriptionRequestMessage: null,
    };

    subscriptionServiceMockup.subscribeFinalUser.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(controller.subscribeLoggedUser(subscribeDto, req)).rejects.toThrow(
      NotFoundException
    );
  });

  it("should unsubscribe a final user from a course", async () => {
    const req = { user: { sub: "1", role: Role.USER } };
    const deleteDto = { course_id: "1", patient_id: "ignored" };

    const result = await controller.unsubscribeLoggedUser(deleteDto, req);

    subscriptionServiceMockup.unsubscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.unsubscribeFinalUser).toHaveBeenCalledWith(
      req.user.sub,
      deleteDto
    );

    expect(result).toBeUndefined();
  });

  it("should unsubscribe the given final user from a course if admin", async () => {
    const deleteDto: SubscriptionDeleteDto = {
      course_id: "1",
      patient_id: randomUUID(),
    };

    const result = await controller.unsubscribeGivenUser(deleteDto);

    subscriptionServiceMockup.unsubscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.unsubscribeFinalUser).toHaveBeenCalledWith(
      deleteDto.patient_id,
      deleteDto
    );

    expect(result).toBeUndefined();
  });

  it("should unsubscribe the given final user from a course if physiotherapist", async () => {
    const patient_id = randomUUID();
    const deleteDto: SubscriptionDeleteDto = { course_id: "1", patient_id };

    const result = await controller.unsubscribeGivenUser(deleteDto);

    subscriptionServiceMockup.unsubscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.unsubscribeFinalUser).toHaveBeenCalledWith(
      deleteDto
    );

    expect(result).toBeUndefined();
  });

  it("should throw exception if admin attempts to unsubscribe without userId", async () => {
    const deleteDto: SubscriptionDeleteDto = {
      course_id: "1",
      patient_id: "2",
    };

    subscriptionServiceMockup.unsubscribeFinalUser.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(async () => {
      await controller.unsubscribeGivenUser(deleteDto);
    }).rejects.toThrow(NotFoundException);
  });

  it("should throw not found exception when user is not found on unsubscribe", async () => {
    const deleteDto: SubscriptionDeleteDto = {
      course_id: "1",
      patient_id: randomUUID(),
    };

    subscriptionServiceMockup.unsubscribeFinalUser.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(controller.unsubscribeGivenUser(deleteDto)).rejects.toThrow(
      NotFoundException
    );
  });

  it("should get the list of subscriptions for a course", async () => {
    const subscribers: SubscriptionDtoWithUser[] = [
      {
        course: null,
        user: {
          id: "1",
          email: "email@email.email",
          firstName: "a",
          lastName: "b",
          middleName: "c",
        },
        created_at: new Date(),
        updated_at: new Date(),
        course_id: "1",
        patient_id: "2",
        isPending: false,
        subscriptionRequestMessage: "MSG1",
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
