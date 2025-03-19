import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionsService } from "./subscriptions.service";
import { PrismaService } from "nestjs-prisma";
import { CourseEntity } from "src/courses/dto/course.dto";
import { toPaginatedOutput } from "src/common/utils/pagination";
import { Course, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { plainToInstance } from "class-transformer";
import { NotFoundException } from "@nestjs/common";
import { applicationUserDtoMock } from "test/mocks/users.mock";

describe("SubsriptionsService", () => {
  let service: SubscriptionsService;

  const prismaMock = {
    courseFinalUser: {
      count: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    course: {
      findUniqueOrThrow: jest.fn(),
    },
    finalUser: {
      findUnique: jest.fn(),
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
        name: "",
        id: uuidCourse,
        description: "",
        short_description: "",
        location: "",
        schedule: [],
        instructors: [],
        category: "ACQUAGYM",
        level: "BASIC",
        frequency: "SINGLE_SESSION",
        session_duration: "",
        cost: new Prisma.Decimal("0"),
        discount: 0,
        availability: "ACTIVE",
        highlighted_priority: 0,
        members_capacity: 0,
        num_registered_members: 0,
        tags: [],
        thumbnail_path: "",
        created_at: undefined,
        updated_at: undefined,
      },
    ];

    const courseSubscribers = [
      {
        course: course[0],
        created_at: new Date(),
        updated_at: new Date(),
        course_id: uuidCourse,
        final_user_id: uuidUser1,
      },
      {
        course: course[0],
        created_at: new Date(),
        updated_at: new Date(),
        course_id: uuidCourse,
        final_user_id: uuidUser2,
      },
    ];

    prismaMock.courseFinalUser.count.mockResolvedValue(2);
    prismaMock.courseFinalUser.findMany.mockResolvedValue(courseSubscribers);

    const result = await service.getCustomerSubscriptions(userId, pagination);

    expect(prismaMock.courseFinalUser.count).toHaveBeenCalledWith({
      where: { final_user_id: userId },
    });

    expect(prismaMock.courseFinalUser.findMany).toHaveBeenCalledWith({
      where: { final_user_id: userId },
      include: { course: true },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    const expectedResult = toPaginatedOutput(
      courseSubscribers.map((x) => plainToInstance(CourseEntity, x.course)),
      2,
      pagination
    );

    expect(result).toEqual(expectedResult);
  });

  it("should subscribe a final user to a course", async () => {
    const userId = "1";
    const courseId = "2";

    const user = {
      applicationUserId: userId,
    };

    const course = {
      id: courseId,
    };

    prismaMock.finalUser.findUnique.mockResolvedValue(user);
    prismaMock.course.findUniqueOrThrow.mockResolvedValue(course);

    await service.subscribeFinalUser(userId, courseId);

    expect(prismaMock.finalUser.findUnique).toHaveBeenCalledWith({
      where: { applicationUserId: userId },
    });

    expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: courseId },
    });

    expect(prismaMock.courseFinalUser.create).toHaveBeenCalledWith({
      data: {
        course_id: courseId,
        final_user_id: userId,
      },
    });
  });

  it("should throw not found exception if final user does not exist", async () => {
    const userId = "1";
    const courseId = "2";

    prismaMock.finalUser.findUnique.mockRejectedValue(() => {
      throw new NotFoundException("User not found");
    });

    expect(service.subscribeFinalUser(userId, courseId)).rejects.toThrow(
      NotFoundException
    );

    expect(prismaMock.finalUser.findUnique).toHaveBeenCalledWith({
      where: { applicationUserId: userId },
    });
  });

  it("should throw not found exception if course does not exist", async () => {
    const userId = "1";
    const courseId = "2";
    prismaMock.finalUser.findUnique.mockResolvedValue({ userId });
    prismaMock.course.findUniqueOrThrow.mockRejectedValue(() => {
      throw new NotFoundException("Course not found");
    });

    expect(service.subscribeFinalUser(userId, courseId)).rejects.toThrow(
      NotFoundException
    );
  });

  it("should unsubscribe a final user from a course", async () => {
    const userId = "1";
    const courseId = "2";

    await service.unsubscribeFinalUser(userId, courseId);

    expect(prismaMock.courseFinalUser.deleteMany).toHaveBeenCalledWith({
      where: { course_id: courseId, final_user_id: userId },
    });
  });

  it("should retrieve subscriptions for a course", async () => {
    const courseId = randomUUID();
    const created_at = new Date();
    const updated_at = new Date();
    const pagination = { page: 1, perPage: 10 };

    const userMock = applicationUserDtoMock();

    prismaMock.courseFinalUser.count.mockResolvedValue(1);
    prismaMock.courseFinalUser.findMany.mockResolvedValue([
      {
        course_id: courseId,
        final_user_id: userMock.id,
        created_at,
        updated_at,
        final_user: {
          applicationUser: {
            ...userMock,
          },
        },
      },
    ]);

    const result = await service.getCourseSubscriptions(courseId, pagination);

    expect(prismaMock.courseFinalUser.count).toHaveBeenCalledWith({
      where: { course_id: courseId },
    });

    expect(prismaMock.courseFinalUser.findMany).toHaveBeenCalledWith({
      where: { course_id: courseId },
      include: { final_user: { include: { applicationUser: true } } },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    const expectedResult = toPaginatedOutput(
      [
        {
          id: userMock.id,
          email: userMock.email,
          firstName: userMock.firstName,
          lastName: userMock.lastName,
          middleName: userMock.middleName,
          subscriptionDate: created_at,
        },
      ],
      1,
      pagination
    );

    expect(result).toEqual(expectedResult);
  });
});
