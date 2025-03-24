import { Test, TestingModule } from "@nestjs/testing";
import { CoursesService } from "./courses.service";
import { PrismaService } from "nestjs-prisma";
import { CourseEntity } from "./dto/course.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCoursesDto } from "./dto/update-course.dto";
import { Decimal } from "@prisma/client/runtime/library";
import {
  CourseAvailability,
  CourseCategory,
  CourseFrequency,
  CourseLevel,
} from "@prisma/client";
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
  it("should create an course", async () => {
    const dto: CreateCourseDto = {
      name: "Test Course",
      description: "ddddddddddd",
      short_description: "dddddddddddd",
      schedule: [],
      instructors: [],
      category: CourseCategory.ACQUAGYM,
      level: CourseLevel.BASIC,
      frequency: CourseFrequency.SINGLE_SESSION,
      session_duration: "111",
      availability: CourseAvailability.ACTIVE,
      num_registered_members: 0,
      tags: ["aa", "bb"],
    };

    prismaMock.course.create.mockResolvedValue(dto);

    const result = await service.create(dto, "1");

    expect(prismaMock.course.create).toHaveBeenCalledWith({
      data: { ...dto, owner_id: "1" },
    });
    expect(result).toEqual({
      ...new CourseEntity({
        ...dto,
      }),
    });
  });

  // FindAll Method Test
  it("should return paginated courses", async () => {
    const pagination = { page: 0, perPage: 2 };
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
        frequency: "SINGLE_SESSION",
        session_duration: "",
        availability: "ACTIVE",
        num_registered_members: 0,
        tags: [],
        created_at: new Date(),
        updated_at: new Date(),
        owner: {
          id: randomUUID(),
          email: "test@mail.com",
          firstName: "",
          lastName: "",
          middleName: "",
        },
      },
      {
        id: "",
        name: "",
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
        created_at: new Date(),
        updated_at: new Date(),
        owner: {
          id: randomUUID(),
          email: "test@mail.com",
          firstName: "",
          lastName: "",
          middleName: "",
        },
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
        plainToInstance(CourseEntity, {
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
    const mockCourse: CourseEntity = {
      id: "",
      name: "",
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
      created_at: new Date(),
      updated_at: new Date(),
      owner: {
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        middleName: "",
      },
    };

    prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

    const result = await service.findOne(id);

    expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(
      new CourseEntity({
        ...mockCourse,
      })
    );
  });

  // Update Method Test
  it("should update an course", async () => {
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

    const result = await service.update(id, dto);

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

  // Remove Method Test
  it("should remove an course", async () => {
    const id = "1";

    prismaMock.course.delete.mockResolvedValue(undefined);

    await service.remove(id);

    expect(prismaMock.course.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
