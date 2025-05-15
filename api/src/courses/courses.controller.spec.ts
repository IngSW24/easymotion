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
import { Course, CourseLevel, PaymentRecurrence } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { CompressionService } from "src/assets/utilities/compression.service";
import { ASSETS_SERVICE } from "src/assets/assets.interface";
import { EmailService } from "src/email/email.service";
import frontendConfig from "src/config/frontend.config";

describe("CoursesController", () => {
  let controller: CoursesController;
  let prismaMock: any;
  let mockupEmailService: any;

  beforeEach(async () => {
    // Mock PrismaService
    prismaMock = {
      $transaction: jest.fn(),
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
      subscription: {
        findMany: jest.fn(),
      },
    };

    const mockupCompressionService = {
      compressImage: jest.fn(),
    };

    const mockupAssetsService = {
      uploadBuffer: jest.fn(),
      deleteFile: jest.fn(),
      getFileStream: jest.fn(),
    };

    mockupEmailService = {
      sendEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        CoursesService, // Use the real service
        {
          provide: PrismaService,
          useValue: prismaMock, // Mock PrismaService
        },
        {
          provide: ASSETS_SERVICE,
          useValue: mockupAssetsService,
        },
        {
          provide: CompressionService,
          useValue: mockupCompressionService,
        },
        {
          provide: EmailService,
          useValue: mockupEmailService,
        },
        {
          provide: frontendConfig.KEY,
          useValue: {
            url: "http://localhost:3000",
          },
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  // Test Create
  it("should create a new course", async () => {
    const categoryId = "f81eed98-99c5-469d-a546-6c9e6d9d7988";
    const dto: CreateCourseDto = {
      name: "Test Course",
      description: "Test Description",
      shortDescription: "Short Description",
      instructors: [],
      categoryId: categoryId,
      level: CourseLevel.BASIC,
      tags: ["aa", "bb"],
      location: "",
      price: new Decimal(100),
      paymentRecurrence: PaymentRecurrence.SINGLE,
      isPublished: false,
      subscriptionsOpen: false,
      maxSubscribers: 0,
      sessions: [],
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(),
    };

    const createdCourse = {
      id: "1",
      ...dto,
      price: new Decimal(100),
    };

    prismaMock.course.create.mockResolvedValue(createdCourse);

    const result = await controller.create(dto, { user: { sub: "1" } });

    expect(prismaMock.course.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        description: dto.description,
        shortDescription: dto.shortDescription,
        instructors: [],
        category: {
          connect: {
            id: categoryId,
          },
        },
        level: CourseLevel.BASIC,
        tags: dto.tags,
        location: "",
        price: new Decimal(100),
        paymentRecurrence: PaymentRecurrence.SINGLE,
        isPublished: false,
        subscriptionsOpen: false,
        maxSubscribers: 0,
        owner: {
          connect: {
            applicationUserId: "1",
          },
        },
        sessions: {
          create: [],
        },
        subscriptionStartDate: dto.subscriptionStartDate,
        subscriptionEndDate: dto.subscriptionEndDate,
      },
      include: {
        category: true,
        owner: {
          include: {
            applicationUser: true,
          },
        },
        sessions: true,
      },
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
        imagePath: "",
        description: "",
        shortDescription: "",
        instructors: [],
        category: {
          id: randomUUID(),
          name: "Category",
        },
        level: CourseLevel.BASIC,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        location: "",
        price: new Decimal(0),
        paymentRecurrence: PaymentRecurrence.SINGLE,
        isPublished: false,
        subscriptionsOpen: false,
        maxSubscribers: 0,
        owner: {
          id: randomUUID(),
          email: "",
          firstName: "",
          lastName: "",
          middleName: "",
        },
        sessions: [],
        ownerId: randomUUID(),
        categoryId: randomUUID(),
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(),
        currentSubscribers: 0,
      },
    ];
    const totalItems = 1;

    prismaMock.course.findMany.mockResolvedValue(mockCourses);
    prismaMock.course.count.mockResolvedValue(totalItems);

    const result = await controller.findAll(pagination, {});

    /*expect(prismaMock.course.findMany).toHaveBeenCalledWith({
      where: { isPublished: true },
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
        createdAt: "desc",
      },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });
    expect(prismaMock.course.count).toHaveBeenCalled();*/
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

    /*expect(result).toEqual({
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
    });*/
  });

  // Test FindOne
  it("should return a single course", async () => {
    const id = "1";
    const mockCourse: Course & { owner: any; category: any; sessions: any } = {
      id,
      name: "Test Course",
      description: "Test Description",
      shortDescription: "Short Description",
      instructors: [],
      imagePath: "",
      category: {
        id: randomUUID(),
        name: "Category",
      },
      level: CourseLevel.BASIC,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      location: "",
      price: new Decimal(10),
      paymentRecurrence: PaymentRecurrence.SINGLE,
      isPublished: false,
      subscriptionsOpen: false,
      maxSubscribers: 0,
      ownerId: randomUUID(),
      categoryId: randomUUID(),
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
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(),
    };

    prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

    const result = await controller.findOne(id);
    const expected = plainToInstance(CourseDto, {
      ...mockCourse,
      owner: mockCourse.owner.applicationUser,
      available_slots: null,
    });

    /*expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
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
    });*/
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    //expect(result).toEqual(expected);
  });

  // Test Update
  it("should update a course", async () => {
    const id = "1";
    const dto: UpdateCourseDto = {
      instructors: ["Updated Instructor"],
      price: new Decimal(250),
      name: "Updated Course",
      description: "Updated Description",
      shortDescription: "Updated Short Description",
      location: "Updated Location",
      level: CourseLevel.MEDIUM,
      paymentRecurrence: PaymentRecurrence.SINGLE,
      isPublished: true,
      subscriptionsOpen: true,
      maxSubscribers: 20,
      tags: ["tag1", "tag2"],
      sessions: [],
    };

    const updatedCourse = {
      id,
      name: dto.name,
      description: dto.description,
      shortDescription: dto.shortDescription,
      instructors: dto.instructors,
      location: dto.location,
      level: dto.level,
      price: dto.price,
      paymentRecurrence: dto.paymentRecurrence,
      isPublished: dto.isPublished,
      subscriptionsOpen: dto.subscriptionsOpen,
      maxSubscribers: dto.maxSubscribers,
      tags: dto.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: randomUUID(),
      categoryId: randomUUID(),
      category: {
        id: randomUUID(),
        name: "Category",
      },
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

    prismaMock.courseSession.findMany.mockResolvedValue([]);
    prismaMock.course.findUniqueOrThrow.mockResolvedValue(updatedCourse);
    prismaMock.course.update.mockResolvedValue(updatedCourse);
    prismaMock.subscription.findMany.mockResolvedValue([]);
    mockupEmailService.sendEmail.mockResolvedValue(undefined);
    const result = await controller.update(id, dto);

    // Check that update was called with correct ID
    expect(prismaMock.course.update.mock.calls[0][0].where).toEqual({ id });

    // Check that data contains all the expected fields with correct values
    const updateData = prismaMock.course.update.mock.calls[0][0].data;
    expect(updateData.name).toBe(dto.name);
    expect(updateData.description).toBe(dto.description);
    expect(updateData.shortDescription).toBe(dto.shortDescription);
    expect(updateData.instructors).toEqual(dto.instructors);
    expect(updateData.location).toBe(dto.location);
    expect(updateData.level).toBe(dto.level);
    expect(updateData.paymentRecurrence).toBe(dto.paymentRecurrence);
    expect(updateData.isPublished).toBe(dto.isPublished);
    expect(updateData.subscriptionsOpen).toBe(dto.subscriptionsOpen);
    expect(updateData.maxSubscribers).toBe(dto.maxSubscribers);
    expect(updateData.tags).toEqual(dto.tags);

    // Check that correct include options were used
    expect(prismaMock.course.update.mock.calls[0][0].include).toEqual({
      owner: {
        include: {
          applicationUser: true,
        },
      },
      category: true,
      sessions: true,
    });

    // Check result
    expect(result).toEqual(
      plainToInstance(CourseDto, {
        ...updatedCourse,
        owner: updatedCourse.owner.applicationUser,
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
