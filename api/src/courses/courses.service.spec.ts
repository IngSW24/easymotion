import { Test, TestingModule } from "@nestjs/testing";
import { CoursesService } from "./courses.service";
import { PrismaService } from "nestjs-prisma";
import { CourseDto } from "./dto/course.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { CourseLevel, PaymentRecurrence } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { randomUUID } from "crypto";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ASSETS_SERVICE } from "src/assets/assets.interface";
import { MockAssetsService } from "src/assets/implementations/mock.service";

describe("CoursesService", () => {
  let service: CoursesService;
  //let prisma: PrismaService;

  const prismaMock = {
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
        {
          provide: ASSETS_SERVICE,
          useClass: MockAssetsService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    //prisma = module.get<PrismaService>(PrismaService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a course", async () => {
      // Setup
      const categoryId = randomUUID();
      const ownerId = randomUUID();

      const createDto: CreateCourseDto = {
        name: "Test Course",
        description: "Course description",
        shortDescription: "Short description",
        location: "Online",
        instructors: ["John Doe"],
        level: CourseLevel.BASIC,
        price: new Decimal(100),
        paymentRecurrence: PaymentRecurrence.SINGLE,
        isPublished: true,
        subscriptionsOpen: true,
        maxSubscribers: 20,
        tags: ["tag1", "tag2"],
        categoryId: categoryId,
        sessions: [
          { startTime: new Date(), endTime: new Date(Date.now() + 3600000) },
        ],
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(),
      };

      const mockCreatedCourse = {
        id: randomUUID(),
        name: createDto.name,
        description: createDto.description,
        shortDescription: createDto.shortDescription,
        location: createDto.location,
        instructors: createDto.instructors,
        level: createDto.level,
        price: createDto.price,
        paymentRecurrence: createDto.paymentRecurrence,
        isPublished: createDto.isPublished,
        subscriptionsOpen: createDto.subscriptionsOpen,
        maxSubscribers: createDto.maxSubscribers,
        tags: createDto.tags,
        ownerId: ownerId,
        categoryId: categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: {
          applicationUser: {
            id: ownerId,
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            middleName: null,
          },
        },
        category: {
          id: categoryId,
          name: "Test Category",
        },
        sessions: [
          {
            startTime: createDto.sessions[0].startTime,
            endTime: createDto.sessions[0].endTime,
          },
        ],
      };

      prismaMock.course.create.mockResolvedValue(mockCreatedCourse);

      // Execute
      const result = await service.create(createDto, ownerId);

      // Verify
      expect(prismaMock.course.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: createDto.name,
          description: createDto.description,
          shortDescription: createDto.shortDescription,
          instructors: createDto.instructors,
          level: createDto.level,
          sessions: {
            create: createDto.sessions,
          },
          category: {
            connect: { id: createDto.categoryId },
          },
          owner: {
            connect: { applicationUserId: ownerId },
          },
        }),
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
  });

  describe("findAll", () => {
    it("should find all courses with pagination and filtering", async () => {
      // Setup
      const pagination: PaginationFilter = { page: 0, perPage: 10 };
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
          shortDescription: "Short Desc",
          level: CourseLevel.BASIC,
          owner: {
            applicationUser: {
              id: randomUUID(),
              email: "test@example.com",
              firstName: "John",
              lastName: "Doe",
              middleName: null,
            },
          },
          category: { id: "id1", name: "Category 1" },
          sessions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          price: new Decimal(100),
          is_free: false,
          isPublished: true,
          subscriptionsOpen: true,
          maxSubscribers: null,
          number_of_payments: null,
          tags: [],
          location: null,
          instructors: [],
          ownerId: "owner1",
          categoryId: "id1",
        },
      ];

      const mockCount = 1;

      prismaMock.course.findMany.mockResolvedValue(mockCourses);
      prismaMock.course.count.mockResolvedValue(mockCount);

      // Execute
      const result = await service.findAll(pagination, filter);

      // Verify
      expect(prismaMock.$transaction).toHaveBeenCalled();
      /*expect(prismaMock.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: pagination.page * pagination.perPage,
          take: pagination.perPage,
          orderBy: {
            createdAt: "desc",
          },
        })
      );*/

      /*expect(result.data.length).toBe(1);
      expect(result.meta.totalItems).toBe(mockCount);
      expect(result.meta.currentPage).toBe(pagination.page);*/
    });
  });

  describe("findOne", () => {
    it("should find a course by id", async () => {
      // Setup
      const courseId = randomUUID();
      const mockCourse = {
        id: courseId,
        name: "Test Course",
        description: "Description",
        shortDescription: "Short Desc",
        level: CourseLevel.BASIC,
        owner: {
          applicationUser: {
            id: randomUUID(),
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            middleName: null,
          },
        },
        category: { id: "id1", name: "Category 1" },
        sessions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        price: new Decimal(100),
        is_free: false,
        isPublished: true,
        subscriptionsOpen: true,
        maxSubscribers: null,
        number_of_payments: null,
        tags: [],
        location: null,
        instructors: [],
        ownerId: "owner1",
        categoryId: "id1",
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(),
      };

      prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

      // Execute
      const result = await service.findOne(courseId);

      // Verify
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      /*expect(result).toBeInstanceOf(CourseDto);
      expect(result.id).toBe(courseId);
      expect(result.owner).toBeDefined();*/
    });
  });

  describe("update", () => {
    it("should update a course including sessions", async () => {
      // Setup
      const courseId = randomUUID();
      const existingSessionId = randomUUID();
      const newSessionStartTime = new Date();
      const newSessionEndTime = new Date(Date.now() + 3600000);

      const updateDto: UpdateCourseDto = {
        name: "Updated Course",
        isPublished: true,
        subscriptionsOpen: true,
        sessions: [
          {
            id: existingSessionId,
            startTime: newSessionStartTime,
            endTime: newSessionEndTime,
          },
          { startTime: new Date(), endTime: new Date(Date.now() + 7200000) },
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
        shortDescription: "Original short description",
        isPublished: true,
        subscriptionsOpen: true,
        owner: {
          applicationUser: {
            id: randomUUID(),
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            middleName: null,
          },
        },
        category: { id: "category1", name: "Category" },
        sessions: [
          {
            id: existingSessionId,
            startTime: newSessionStartTime,
            endTime: newSessionEndTime,
            courseId: courseId,
          },
          {
            id: randomUUID(),
            startTime: updateDto.sessions![1].startTime,
            endTime: updateDto.sessions![1].endTime,
            courseId: courseId,
          },
        ],
        level: CourseLevel.BASIC,
        createdAt: new Date(),
        updatedAt: new Date(),
        price: new Decimal(100),
        is_free: false,
        maxSubscribers: null,
        number_of_payments: null,
        tags: [],
        location: null,
        instructors: [],
        ownerId: "owner1",
        categoryId: "category1",
      };

      prismaMock.course.update.mockResolvedValue(updatedCourse);

      // Execute
      const result = await service.update(courseId, updateDto);

      // Verify
      const updateCall = prismaMock.course.update.mock.calls[0][0];

      expect(updateCall.where).toEqual({ id: courseId });
      expect(updateCall.data.name).toBe("Updated Course");

      // Check session management
      expect(updateCall.data.sessions).toBeDefined();

      expect(result).toBeInstanceOf(CourseDto);
      expect(result.name).toBe("Updated Course");
      expect(result.owner).toBeDefined();
      expect(result.sessions.length).toBe(2);
    });
  });

  describe("remove", () => {
    it("should remove a course", async () => {
      const courseId = randomUUID();
      prismaMock.course.delete.mockResolvedValue(undefined);

      await service.remove(courseId);

      expect(prismaMock.course.delete).toHaveBeenCalledWith({
        where: { id: courseId },
      });
    });
  });

  describe("findSubscribedCourses", () => {
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
            shortDescription: "Short description",
            owner: {
              applicationUser: {
                id: randomUUID(),
                email: "test@example.com",
                firstName: "John",
                lastName: "Doe",
                middleName: null,
              },
            },
            category: { id: "category1", name: "Category" },
            level: CourseLevel.BASIC,
            createdAt: new Date(),
            updatedAt: new Date(),
            price: new Decimal(100),
            is_free: false,
            isPublished: true,
            subscriptionsOpen: true,
            maxSubscribers: null,
            number_of_payments: null,
            tags: [],
            location: null,
            instructors: [],
            ownerId: "owner1",
            categoryId: "category1",
          },
        },
      ];

      const mockCount = 1;

      prismaMock.subscription.findMany.mockResolvedValue(mockSubscriptions);
      prismaMock.subscription.count.mockResolvedValue(mockCount);

      const result = await service.findSubscribedCourses(
        userId,
        pagination,
        filters
      );

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);

      /*expect(prismaMock.subscription.count).toHaveBeenCalledWith({
        where: { patientId: userId, isPending: false },
      });

      expect(prismaMock.subscription.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: pagination.page * pagination.perPage,
          take: pagination.perPage,
        })
      );

      expect(result.data.length).toBe(1);
      expect(result.meta.totalItems).toBe(mockCount);*/
    });
  });

  it("should handle decimal conversion correctly", () => {
    const course = {
      price: 100,
    };

    const courseDto = plainToInstance(CourseDto, course);

    expect(Number(courseDto.price)).toBe(100);
  });

  it("should update image", async () => {
    const courseId = randomUUID();
    const buffer = Buffer.from("test");
    const mimeType = "image/jpeg";

    prismaMock.$transaction.mockResolvedValue({ id: courseId });

    const result = await service.updateImage(courseId, buffer, mimeType);

    expect(result).toBeDefined();
    expect(result.imagePath).toBeDefined();
  });
});
