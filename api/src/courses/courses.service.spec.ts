import { Test, TestingModule } from "@nestjs/testing";
import { CoursesService } from "./courses.service";
import { PrismaService } from "nestjs-prisma";
import { CourseDto } from "./dto/course.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { Course, CourseLevel } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { randomUUID } from "crypto";

describe("CoursesService", () => {
  let service: CoursesService;

  // Mock PrismaService
  const prismaMock = {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  // Create Method Test
  it("should create a course", async () => {
    const dto: CreateCourseDto = {
      name: "Test Course",
      description: "Test Description",
      short_description: "Short Description",
      instructors: [],
      category_id: randomUUID(),
      level: CourseLevel.BASIC,
      tags: ["aa", "bb"],
      location: "",
      is_free: false,
      price: new Decimal(12),
      number_of_payments: 0,
      is_published: false,
      subscriptions_open: false,
      max_subscribers: 0,
      sessions: [],
    };

    prismaMock.course.create.mockResolvedValue(dto);

    const result = await service.create(dto, "1");

    expect(prismaMock.course.create).toHaveBeenCalledWith({
      data: { ...dto, owner_id: "1" },
    });
    expect(result).toEqual({
      ...dto,
    });
  });

  // FindAll Method Test
  it("should return paginated courses", async () => {
    const pagination = { page: 0, perPage: 2 };
    const mockCourses: CourseDto[] = [
      {
        id: "",
        name: "",
        description: "",
        short_description: "",
        instructors: [],
        category: {
          id: randomUUID(),
          name: "Category",
        },
        level: CourseLevel.BASIC,
        tags: [],
        created_at: new Date(),
        updated_at: new Date(),
        location: "",
        is_free: false,
        price: new Decimal(0),
        number_of_payments: 0,
        is_published: false,
        subscriptions_open: false,
        max_subscribers: 0,
        owner: {
          id: randomUUID(),
          email: "test@mail.com",
          firstName: "",
          lastName: "",
          middleName: "",
        },
        sessions: [],
        owner_id: randomUUID(),
        category_id: randomUUID(),
      },
      {
        id: "",
        name: "",
        description: "",
        short_description: "",
        instructors: [],
        category: {
          id: randomUUID(),
          name: "Category",
        },
        level: CourseLevel.BASIC,
        tags: [],
        created_at: new Date(),
        updated_at: new Date(),
        location: "",
        is_free: false,
        price: new Decimal(0),
        number_of_payments: 0,
        is_published: false,
        subscriptions_open: false,
        max_subscribers: 0,
        owner: {
          id: randomUUID(),
          email: "test@mail.com",
          firstName: "",
          lastName: "",
          middleName: "",
        },
        sessions: [],
        owner_id: randomUUID(),
        category_id: randomUUID(),
      },
    ];
    const totalItems = 5;

    prismaMock.course.findMany.mockResolvedValue(mockCourses);
    prismaMock.course.count.mockResolvedValue(totalItems);

    const result = await service.findAll(pagination, undefined);

    expect(prismaMock.course.findMany).toHaveBeenCalledWith({
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
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });
    expect(prismaMock.course.count).toHaveBeenCalled();

    expect(result).toEqual({
      data: mockCourses.map((course) =>
        plainToInstance(CourseDto, {
          ...course,
          owner: undefined,
        })
      ),
      meta: {
        currentPage: pagination.page,
        items: 2,
        hasNextPage: true,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / pagination.perPage),
      },
    });
  });

  // FindOne Method Test
  it("should return a single course", async () => {
    const id = "1";
    const ownerUuid = randomUUID();
    const mockCourse: Course & { owner: any; category: any; sessions: any } = {
      id: "",
      name: "",
      description: "",
      short_description: "",
      instructors: [],
      category: {
        id: randomUUID(),
        name: "Category",
      },
      level: CourseLevel.BASIC,
      tags: [],
      created_at: new Date(),
      updated_at: new Date(),
      location: "",
      is_free: false,
      price: new Decimal(0),
      number_of_payments: 0,
      is_published: false,
      subscriptions_open: false,
      max_subscribers: 0,
      owner_id: ownerUuid,
      category_id: randomUUID(),
      owner: {
        applicationUser: {
          id: ownerUuid,
          email: "",
          firstName: "",
          lastName: "",
          middleName: "",
        },
      },
      sessions: [],
    };

    prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

    const result = await service.findOne(id);
    const expected = plainToInstance(CourseDto, {
      ...mockCourse,
      owner: mockCourse.owner.applicationUser,
    });

    expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: {
        owner: {
          include: { applicationUser: true },
        },
        category: true,
        sessions: true,
      },
    });

    expect(result).toEqual(expected);
  });

  // Update Method Test
  it("should update a course", async () => {
    const id = "1";
    const dto: UpdateCourseDto = {
      instructors: ["Updated Instructor"],
      price: new Decimal(250),
      category_id: "",
      sessions: [],
      name: "",
      description: "",
      short_description: "",
      location: "",
      level: "BASIC",
      is_free: false,
      number_of_payments: 0,
      is_published: false,
      subscriptions_open: false,
      max_subscribers: 0,
      tags: [],
    };

    const updatedCourse = {
      id,
      ...dto,
    };

    prismaMock.course.update.mockResolvedValue(updatedCourse);

    const result = await service.update(id, dto);

    expect(prismaMock.course.update).toHaveBeenCalledWith({
      where: { id },
      data: { ...dto },
    });
    expect(result).toEqual(plainToInstance(CourseDto, updatedCourse));
  });

  // Remove Method Test
  it("should remove a course", async () => {
    const id = "1";

    prismaMock.course.delete.mockResolvedValue(undefined);

    await service.remove(id);

    expect(prismaMock.course.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
