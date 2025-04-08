import { Test, TestingModule } from "@nestjs/testing";
import { CoursesService } from "./courses.service";
import { PrismaService } from "nestjs-prisma";
import { CourseDto } from "./dto/course.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { CourseLevel } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { randomUUID } from "crypto";

describe("CoursesService", () => {
  let service: CoursesService;

  const prismaMock = {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    courseSession: {
      findMany: jest.fn(),
    },
    courseFinalUser: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a course", async () => {
    const categoryId = randomUUID();
    const ownerId = randomUUID();

    const createDto: CreateCourseDto = {
      name: "Test Course",
      description: "Course description",
      short_description: "Short description",
      location: "Online",
      instructors: ["John Doe"],
      level: CourseLevel.BASIC,
      is_free: false,
      price: new Decimal(100),
      number_of_payments: 2,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: 20,
      tags: ["tag1", "tag2"],
      category_id: categoryId,
      sessions: [
        { start_time: new Date(), end_time: new Date(Date.now() + 3600000) },
      ],
    };

    const mockCreatedCourse = {
      id: randomUUID(),
      ...createDto,
      owner_id: ownerId,
      category_id: categoryId,
      created_at: new Date(),
      updated_at: new Date(),
      owner: {
        applicationUser: {
          id: ownerId,
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
      category: {
        id: categoryId,
        name: "Test Category",
      },
      sessions: [
        {
          id: randomUUID(),
          start_time: createDto.sessions[0].start_time,
          end_time: createDto.sessions[0].end_time,
          course_id: "course-id",
        },
      ],
    };

    prismaMock.course.create.mockResolvedValue(mockCreatedCourse);

    const result = await service.create(createDto, ownerId);

    expect(prismaMock.course.create).toHaveBeenCalledWith({
      data: {
        name: createDto.name,
        description: createDto.description,
        short_description: createDto.short_description,
        location: createDto.location,
        instructors: createDto.instructors,
        level: createDto.level,
        is_free: createDto.is_free,
        price: createDto.price,
        number_of_payments: createDto.number_of_payments,
        is_published: createDto.is_published,
        subscriptions_open: createDto.subscriptions_open,
        max_subscribers: createDto.max_subscribers,
        tags: createDto.tags,
        sessions: {
          create: createDto.sessions,
        },
        category: {
          connect: { id: createDto.category_id },
        },
        owner: {
          connect: { applicationUserId: ownerId },
        },
      },
      include: {
        owner: { include: { applicationUser: true } },
        category: true,
        sessions: true,
      },
    });

    expect(result).toBeInstanceOf(CourseDto);
    expect(result.id).toBe(mockCreatedCourse.id);
    expect(result.name).toBe(createDto.name);
    expect(result.owner).toBeDefined();
  });

  it("should find all courses with pagination and filtering", async () => {
    const pagination = { page: 0, perPage: 10 };
    const filter = {
      searchText: "test",
      categoryIds: "id1,id2",
      level: CourseLevel.BASIC,
    };

    const mockCourses = [
      {
        id: randomUUID(),
        name: "Test Course",
        description: "Description",
        short_description: "Short Desc",
        level: CourseLevel.BASIC,
        owner: {
          applicationUser: {
            id: randomUUID(),
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
          },
        },
        category: { id: "id1", name: "Category 1" },
        sessions: [],
        created_at: new Date(),
        updated_at: new Date(),
        price: new Decimal(100),
        is_free: false,
        is_published: true,
        subscriptions_open: true,
        max_subscribers: null,
        number_of_payments: null,
        tags: [],
        location: null,
        instructors: [],
        owner_id: "owner1",
        category_id: "id1",
      },
    ];

    const mockCount = 1;

    prismaMock.course.findMany.mockResolvedValue(mockCourses);
    prismaMock.course.count.mockResolvedValue(mockCount);

    const result = await service.findAll(pagination, filter);

    expect(prismaMock.course.count).toHaveBeenCalled();
    expect(prismaMock.course.findMany).toHaveBeenCalledWith({
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
      where: {
        name: {
          contains: filter.searchText,
          mode: "insensitive",
        },
        category: {
          id: {
            in: filter.categoryIds.split(","),
          },
        },
        level: filter.level,
      },
      include: {
        owner: {
          include: {
            applicationUser: true,
          },
        },
        category: true,
        sessions: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    expect(result.data).toHaveLength(1);
    expect(result.meta.totalItems).toBe(mockCount);
    expect(result.meta.currentPage).toBe(pagination.page);
  });

  it("should find a course by id", async () => {
    const courseId = randomUUID();
    const mockCourse = {
      id: courseId,
      name: "Test Course",
      description: "Description",
      short_description: "Short Desc",
      level: CourseLevel.BASIC,
      owner: {
        applicationUser: {
          id: randomUUID(),
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
      category: { id: "id1", name: "Category 1" },
      sessions: [],
      created_at: new Date(),
      updated_at: new Date(),
      price: new Decimal(100),
      is_free: false,
      is_published: true,
      subscriptions_open: true,
      max_subscribers: null,
      number_of_payments: null,
      tags: [],
      location: null,
      instructors: [],
      owner_id: "owner1",
      category_id: "id1",
    };

    prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

    const result = await service.findOne(courseId);

    expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: courseId },
      include: {
        owner: {
          include: { applicationUser: true },
        },
        sessions: true,
        category: true,
      },
    });

    expect(result).toBeInstanceOf(CourseDto);
    expect(result.id).toBe(courseId);
    expect(result.owner).toEqual(mockCourse.owner.applicationUser);
  });

  it("should update a course including sessions", async () => {
    const courseId = randomUUID();
    const existingSessionId = randomUUID();
    const newSessionStartTime = new Date();
    const newSessionEndTime = new Date(Date.now() + 3600000);

    const updateDto: UpdateCourseDto = {
      name: "Updated Course",
      is_published: true,
      subscriptions_open: true,
      sessions: [
        {
          id: existingSessionId,
          start_time: newSessionStartTime,
          end_time: newSessionEndTime,
        },
        { start_time: new Date(), end_time: new Date(Date.now() + 7200000) },
      ],
    };

    prismaMock.courseSession.findMany.mockResolvedValue([
      { id: existingSessionId },
      { id: randomUUID() },
    ]);

    const updatedCourse = {
      id: courseId,
      name: "Updated Course",
      description: "Original description",
      short_description: "Original short description",
      is_published: true,
      subscriptions_open: true,
      owner: {
        applicationUser: {
          id: randomUUID(),
          email: "test@example.com",
          firstName: "John",
          lastName: "Doe",
        },
      },
      category: { id: "category1", name: "Category" },
      sessions: [
        {
          id: existingSessionId,
          start_time: newSessionStartTime,
          end_time: newSessionEndTime,
          course_id: courseId,
        },
        {
          id: randomUUID(),
          start_time: updateDto.sessions![1].start_time,
          end_time: updateDto.sessions![1].end_time,
          course_id: courseId,
        },
      ],
      level: CourseLevel.BASIC,
      created_at: new Date(),
      updated_at: new Date(),
      price: new Decimal(100),
      is_free: false,
      max_subscribers: null,
      number_of_payments: null,
      tags: [],
      location: null,
      instructors: [],
      owner_id: "owner1",
      category_id: "category1",
    };

    prismaMock.course.update.mockResolvedValue(updatedCourse);

    const result = await service.update(courseId, updateDto);

    const updateCall = prismaMock.course.update.mock.calls[0][0];

    expect(updateCall.where).toEqual({ id: courseId });

    expect(updateCall.data.name).toBe("Updated Course");

    expect(updateCall.data.sessions.deleteMany).toBeDefined();
    expect(updateCall.data.sessions.updateMany).toBeDefined();
    expect(updateCall.data.sessions.create).toBeDefined();

    expect(result).toBeInstanceOf(CourseDto);
    expect(result.name).toBe("Updated Course");
    expect(result.owner).toEqual(updatedCourse.owner.applicationUser);
    expect(result.sessions).toHaveLength(2);
  });

  it("should remove a course", async () => {
    const courseId = randomUUID();
    prismaMock.course.delete.mockResolvedValue(undefined);

    await service.remove(courseId);

    expect(prismaMock.course.delete).toHaveBeenCalledWith({
      where: { id: courseId },
    });
  });

  it("should find courses a user is subscribed to", async () => {
    const userId = randomUUID();
    const pagination = { page: 0, perPage: 10 };
    const filters = { searchText: "test" };

    const mockSubscriptions = [
      {
        course: {
          id: randomUUID(),
          name: "Test Course",
          description: "Description",
          short_description: "Short description",
          owner: {
            applicationUser: {
              id: randomUUID(),
              email: "test@example.com",
              firstName: "John",
              lastName: "Doe",
            },
          },
          category: { id: "category1", name: "Category" },
          level: CourseLevel.BASIC,
          created_at: new Date(),
          updated_at: new Date(),
          price: new Decimal(100),
          is_free: false,
          is_published: true,
          subscriptions_open: true,
          max_subscribers: null,
          number_of_payments: null,
          tags: [],
          location: null,
          instructors: [],
          owner_id: "owner1",
          category_id: "category1",
        },
      },
    ];

    const mockCount = 1;

    prismaMock.courseFinalUser.findMany.mockResolvedValue(mockSubscriptions);
    prismaMock.courseFinalUser.count.mockResolvedValue(mockCount);

    const result = await service.findSubscribedCourses(
      userId,
      pagination,
      filters
    );

    expect(prismaMock.courseFinalUser.count).toHaveBeenCalledWith({
      where: { final_user_id: userId },
    });

    expect(prismaMock.courseFinalUser.findMany).toHaveBeenCalledWith({
      where: {
        AND: [
          { final_user_id: userId },
          {
            OR: [
              {
                course: {
                  name: {
                    contains: filters.searchText,
                    mode: "insensitive",
                  },
                },
              },
              {
                course: {
                  description: {
                    contains: filters.searchText,
                    mode: "insensitive",
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        course: {
          include: {
            owner: {
              include: { applicationUser: true },
            },
            category: true,
          },
        },
      },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    expect(result.data).toHaveLength(1);
    expect(result.meta.totalItems).toBe(mockCount);
    expect(result.meta.currentPage).toBe(pagination.page);
  });

  it("should find all courses by physiotherapist", async () => {
    const physioId = randomUUID();
    const pagination = { page: 0, perPage: 10 };

    const mockCourses = [
      {
        id: randomUUID(),
        name: "Test Course",
        description: "Description",
        short_description: "Short Desc",
        level: CourseLevel.BASIC,
        owner: {
          applicationUser: {
            id: physioId,
            email: "physio@example.com",
            firstName: "John",
            lastName: "Doe",
          },
        },
        category: { id: "id1", name: "Category 1" },
        sessions: [],
        created_at: new Date(),
        updated_at: new Date(),
        price: new Decimal(100),
        is_free: false,
        is_published: true,
        subscriptions_open: true,
        max_subscribers: null,
        number_of_payments: null,
        tags: [],
        location: null,
        instructors: [],
        owner_id: physioId,
        category_id: "id1",
      },
    ];

    const mockCount = 1;

    prismaMock.course.findMany.mockResolvedValue(mockCourses);
    prismaMock.course.count.mockResolvedValue(mockCount);

    const result = await service.findAllByPhysiotherapist(physioId, pagination);

    expect(prismaMock.course.count).toHaveBeenCalledWith({
      where: { owner_id: physioId },
    });

    expect(prismaMock.course.findMany).toHaveBeenCalledWith({
      where: { owner_id: physioId },
      include: {
        owner: {
          include: { applicationUser: true },
        },
        category: true,
        sessions: true,
      },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    expect(result.data).toHaveLength(1);
    expect(result.meta.totalItems).toBe(mockCount);

    expect(result.data[0].owner.id).toBe(physioId);
  });

  it("should read number as decimal", () => {
    const course = {
      price: 100,
    };

    const courseDto = plainToInstance(CourseDto, course);

    expect(Number(courseDto.price)).toBe(100);
  });
});
