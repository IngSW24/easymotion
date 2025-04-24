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
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ASSETS_SERVICE } from "src/assets/assets.interface";
import { MockAssetsService } from "src/assets/implementations/mock.service";

describe("CoursesService", () => {
  let service: CoursesService;
  //let prisma: PrismaService;

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
        subscription_start_date: new Date(),
        subscription_end_date: new Date(),
      };

      const mockCreatedCourse = {
        id: randomUUID(),
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
            middleName: null,
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

      // Execute
      const result = await service.create(createDto, ownerId);

      // Verify
      expect(prismaMock.course.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: createDto.name,
          description: createDto.description,
          short_description: createDto.short_description,
          instructors: createDto.instructors,
          level: createDto.level,
          is_free: createDto.is_free,
          sessions: {
            create: createDto.sessions,
          },
          category: {
            connect: { id: createDto.category_id },
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
          short_description: "Short Desc",
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

      // Execute
      const result = await service.findAll(pagination, filter);

      // Verify
      expect(prismaMock.course.count).toHaveBeenCalled();
      expect(prismaMock.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: pagination.page * pagination.perPage,
          take: pagination.perPage,
          orderBy: {
            created_at: "desc",
          },
        })
      );

      expect(result.data.length).toBe(1);
      expect(result.meta.totalItems).toBe(mockCount);
      expect(result.meta.currentPage).toBe(pagination.page);
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
        short_description: "Short Desc",
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
        subscription_start_date: new Date(),
        subscription_end_date: new Date(),
      };

      prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

      // Execute
      const result = await service.findOne(courseId);

      // Verify
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
      expect(result.owner).toBeDefined();
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
            middleName: null,
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
            short_description: "Short description",
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

      expect(prismaMock.courseFinalUser.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: pagination.page * pagination.perPage,
          take: pagination.perPage,
        })
      );

      expect(result.data.length).toBe(1);
      expect(result.meta.totalItems).toBe(mockCount);
    });
  });

  describe("findAllByPhysiotherapist", () => {
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
              middleName: null,
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

      const result = await service.findAllByPhysiotherapist(
        physioId,
        pagination
      );

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

      expect(result.data.length).toBe(1);
      expect(result.meta.totalItems).toBe(mockCount);
      expect(result.data[0].owner).toBeDefined();
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

    const result = await service.updateImage(courseId, buffer, mimeType);

    expect(result).toBeDefined();
    expect(result.image_path).toBeDefined();
  });
});
