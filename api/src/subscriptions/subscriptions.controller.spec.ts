import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";
import { PrismaService } from "nestjs-prisma";
import { NotFoundException } from "@nestjs/common";

describe("SubscriptionsController", () => {
  let controller: SubscriptionsController;

  const subscriptionServiceMockup = {
    getCustomerSubscriptions: jest.fn(),
    subscribeFinalUser: jest.fn(),
    unsubscribeFinalUser: jest.fn(),
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

    const result = await controller.getSubscriptions(req, pagination);

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
    const req = { user: { sub: "1" } };
    const courseId = "1";

    const result = await controller.subscribe(courseId, req);

    subscriptionServiceMockup.subscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.subscribeFinalUser).toHaveBeenCalledWith(
      req.user.sub,
      courseId
    );

    expect(result).toBeUndefined();
  });

  it("should throw not found exception when user is not found on subscribe", async () => {
    const req = { user: { sub: "1" } };
    const courseId = "1";

    subscriptionServiceMockup.subscribeFinalUser.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(controller.subscribe(courseId, req)).rejects.toThrow(
      NotFoundException
    );
  });
});
