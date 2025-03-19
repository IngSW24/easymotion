import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";
import { PrismaService } from "nestjs-prisma";
import { NotFoundException } from "@nestjs/common";
import { CourseSubcriberDto } from "./dto/course-subcriber.dto";
import { toPaginatedOutput } from "src/common/utils/pagination";

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

  it("should unsubscribe a final user from a course", async () => {
    const req = { user: { sub: "1" } };
    const courseId = "1";

    const result = await controller.unsubscribe(courseId, req);

    subscriptionServiceMockup.unsubscribeFinalUser.mockReturnValue(undefined);

    expect(subscriptionServiceMockup.unsubscribeFinalUser).toHaveBeenCalledWith(
      req.user.sub,
      courseId
    );

    expect(result).toBeUndefined();
  });

  it("should throw not found exception when user is not found on unsubscribe", async () => {
    const req = { user: { sub: "1" } };
    const courseId = "1";

    subscriptionServiceMockup.unsubscribeFinalUser.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(controller.unsubscribe(courseId, req)).rejects.toThrow(
      NotFoundException
    );
  });

  it("should get the list of subscriptions for a course", async () => {
    const subscribers: CourseSubcriberDto[] = [
      {
        id: "1",
        email: "email@email.email",
        firstName: "a",
        lastName: "b",
        middleName: "c",
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
