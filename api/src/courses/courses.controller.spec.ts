import { Test, TestingModule } from "@nestjs/testing";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { PrismaService } from "nestjs-prisma";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCoursesDto } from "./dto/update-course.dto";
import { CourseEntity } from "./dto/course.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { randomUUID } from "node:crypto";
import { Course } from "@prisma/client";
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
    const dto = new CreateCourseDto({
      name: "aa",
      description: "",
      short_description: "",
      schedule: [],
      instructors: [],
      category: "ACQUAGYM",
      level: "BASIC",
      frequency: "SINGLE_SESSION",
      session_duration: "",
      availability: "ACTIVE",
      num_registered_members: 0,
      tags: [],
      cost: 100,
      created_at: new Date(),
      updated_at: new Date(),
      discount: null,
      highlighted_priority: null,
      location: null,
      members_capacity: null,
      thumbnail_path: null,
    });

    const createdCourse = new CourseEntity({
      id: "1",
      ...dto,
      cost: new Decimal(100),
    });

    prismaMock.course.create.mockResolvedValue(createdCourse);

    const result = await controller.create(dto, { user: { sub: "1" } });

    expect(prismaMock.course.create).toHaveBeenCalledWith({
      data: { ...dto, owner_id: "1" },
    });
    expect(result).toEqual({
      ...createdCourse,
      cost: createdCourse.cost.toNumber(),
    });
  });

  // Test FindAll
  it("should return paginated courses", async () => {
    const pagination: PaginationFilter = { page: 0, perPage: 10 };

    const mockCourses: CourseEntity[] = [
      {
        id: "",
        name: "",
        description: "",
        short_description: "",
        schedule: [],
        instructors: [],
        category: "ACQUAGYM",
        level: "BASIC",
        discount: null,
        frequency: "SINGLE_SESSION",
        cost: undefined,
        location: null,
        members_capacity: null,
        highlighted_priority: null,
        session_duration: "",
        availability: "ACTIVE",
        num_registered_members: 0,
        tags: [],
        created_at: new Date(),
        updated_at: new Date(),
        thumbnail_path: null,

        owner: {
          id: "",
          email: "",
          firstName: "",
          lastName: "",
          middleName: "",
        },
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
      },
      orderBy: {
        created_at: "desc",
      },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });
    expect(prismaMock.course.count).toHaveBeenCalled();

    expect(result).toEqual({
      data: mockCourses.map((x) => ({ ...x, owner: undefined })),
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
    const mockCourse: Course & { owner: any } = {
      id,
      description: "aaaaa",
      short_description: "",
      schedule: [],
      instructors: [],
      category: "ACQUAGYM",
      level: "BASIC",
      frequency: "SINGLE_SESSION",
      session_duration: "",
      availability: "ACTIVE",
      num_registered_members: 0,
      tags: [],
      name: "aaaaaaaaaa",
      created_at: new Date(),
      updated_at: new Date(),
      location: "",
      cost: new Decimal(10),
      discount: 0,
      highlighted_priority: 0,
      members_capacity: 0,
      thumbnail_path: "",
      owner_id: randomUUID(),
      owner: {
        applicationUser: {
          id: randomUUID(),
          email: "test@email.com",
          firstName: "fname",
          lastName: "lname",
          middleName: "mname",
        },
      },
    };

    prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

    const result = await controller.findOne(id);
    const expected = plainToInstance(CourseEntity, {
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
      },
    });
    expect(result).toEqual(expected);
  });

  // Test Update
  it("should update a course", async () => {
    const id = "1";
    const dto: UpdateCoursesDto = {
      instructors: ["Updated Organizer"],
      cost: new Decimal(250),
    };

    const updatedCourse = new UpdateCoursesDto({
      id,
      ...dto,
      cost: new Decimal(250),
    });

    prismaMock.course.update.mockResolvedValue(updatedCourse);

    const result = await controller.update(id, dto);

    expect(prismaMock.course.update).toHaveBeenCalledWith({
      where: { id },
      data: { ...dto },
    });
    expect(result).toEqual(
      new CourseEntity({
        ...updatedCourse,
      })
    );
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
