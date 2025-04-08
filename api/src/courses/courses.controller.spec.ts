import { Test, TestingModule } from "@nestjs/testing";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { PrismaService } from "nestjs-prisma";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CourseDto } from "./dto/course.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { randomUUID } from "node:crypto";
import { Course, CourseLevel } from "@prisma/client";
import { plainToInstance } from "class-transformer";

describe("CoursesController", () => {
  let controller: CoursesController;
  let prismaMock: any;

  beforeEach(async () => {
    // Mock PrismaService
    prismaMock = {
      course: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        CoursesService, // Use the real service
        {
          provide: PrismaService,
          useValue: prismaMock, // Mock PrismaService
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  // Test Create
  it("should create a new course", async () => {
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
      price: new Decimal(100),
      number_of_payments: 0,
      is_published: false,
      subscriptions_open: false,
      max_subscribers: 0,
      sessions: [],
    };

    const createdCourse = {
      id: "1",
      ...dto,
      price: new Decimal(100),
    };

    prismaMock.course.create.mockResolvedValue(createdCourse);

    const result = await controller.create(dto, { user: { sub: "1" } });

    expect(prismaMock.course.create).toHaveBeenCalledWith({
      data: { ...dto, owner_id: "1" },
    });
    expect(result).toEqual(
      plainToInstance(CourseDto, {
        ...createdCourse,
        price: createdCourse.price.toNumber(),
      })
    );
  });

  // Test FindAll
  it("should return paginated courses", async () => {
    const pagination: PaginationFilter = { page: 0, perPage: 10 };

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
          email: "",
          firstName: "",
          lastName: "",
          middleName: "",
        },
        sessions: [],
        owner_id: randomUUID(),
        category_id: randomUUID(),
      },
    ];
    const totalItems = 1;

    prismaMock.course.findMany.mockResolvedValue(mockCourses);
    prismaMock.course.count.mockResolvedValue(totalItems);

    const result = await controller.findAll(pagination, {});

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
      data: mockCourses.map((x) =>
        plainToInstance(CourseDto, { ...x, owner: undefined })
      ),
      meta: {
        currentPage: pagination.page,
        items: 1,
        hasNextPage: false,
        totalItems: totalItems,
        totalPages: 1,
      },
    });
  });

  // Test FindOne
  it("should return a single course", async () => {
    const id = "1";
    const mockCourse: Course & { owner: any; category: any; sessions: any } = {
      id,
      name: "Test Course",
      description: "Test Description",
      short_description: "Short Description",
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
      price: new Decimal(10),
      number_of_payments: 0,
      is_published: false,
      subscriptions_open: false,
      max_subscribers: 0,
      owner_id: randomUUID(),
      category_id: randomUUID(),
      owner: {
        applicationUser: {
          id: randomUUID(),
          email: "test@email.com",
          firstName: "fname",
          lastName: "lname",
          middleName: "mname",
        },
      },
      sessions: [],
    };

    prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

    const result = await controller.findOne(id);
    const expected = plainToInstance(CourseDto, {
      ...mockCourse,
      owner: mockCourse.owner.applicationUser,
    });

    expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: {
        owner: {
          include: {
            applicationUser: true,
          },
        },
        category: true,
        sessions: true,
      },
    });
    expect(result).toEqual(expected);
  });

  // Test Update
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

    const result = await controller.update(id, dto);

    expect(prismaMock.course.update).toHaveBeenCalledWith({
      where: { id },
      data: { ...dto },
    });
    expect(result).toEqual(plainToInstance(CourseDto, updatedCourse));
  });

  // Test Remove
  it("should remove a course", async () => {
    const id = "1";

    prismaMock.course.delete.mockResolvedValue(undefined);

    const result = await controller.remove(id);

    expect(prismaMock.course.delete).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toBeUndefined();
  });
});
