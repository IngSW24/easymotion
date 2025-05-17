import { Test, TestingModule } from "@nestjs/testing";
import { SearchService } from "./search.service";
import { EXTENDED_PRISMA_SERVICE } from "src/common/prisma/pagination";
import { SearchFilter } from "./dto/search-filter.dto";
import { User, Role } from "@prisma/client";

describe("SearchService", () => {
  let service: SearchService;
  let mockPrismaService: any;

  const mockPhysiotherapist = {
    user: {
      id: "1",
      firstName: "John",
      middleName: null,
      lastName: "Doe",
      email: "john@example.com",
      isEmailVerified: true,
    },
    specialization: "Sports",
    publicAddress: "123 Main St",
    _count: {
      courses: 5,
    },
  };

  const mockCourse = {
    id: "1",
    name: "Test Course",
    description: "Test Description",
    shortDescription: "Short Test",
    imagePath: "test.jpg",
    isPublished: true,
    category: {
      name: "Fitness",
    },
    _count: {
      subscriptions: 10,
    },
  };

  const createMockUser = (middleName: string | null = null): User => ({
    id: "1",
    firstName: "John",
    middleName,
    lastName: "Doe",
    email: "test@example.com",
    role: Role.PHYSIOTHERAPIST,
    isEmailVerified: true,
    emailConfirmationToken: "token",
    emailConfirmationTokenExpiry: new Date(),
    passwordHash: "hash",
    passwordResetToken: "reset-token",
    passwordResetTokenExpiry: new Date(),
    picturePath: null,
    phoneNumber: null,
    birthDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    twoFactorCode: "",
    twoFactorExpiry: undefined,
    twoFactorEnabled: false,
    lastLogin: undefined,
    failedLoginAttempts: 0,
  });

  beforeEach(async () => {
    mockPrismaService = {
      client: {
        physiotherapist: {
          findMany: jest.fn(),
        },
        course: {
          findMany: jest.fn(),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: EXTENDED_PRISMA_SERVICE,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("searchMatchingEntities", () => {
    it("should return combined search results", async () => {
      // Arrange
      const filter: SearchFilter = { query: "test" };
      mockPrismaService.client.physiotherapist.findMany.mockResolvedValue([
        mockPhysiotherapist,
      ]);
      mockPrismaService.client.course.findMany.mockResolvedValue([mockCourse]);

      // Act
      const result = await service.searchMatchingEntities(filter);

      // Assert
      expect(result).toEqual({
        physiotherapists: [
          {
            id: "1",
            fullName: "John Doe",
            specialization: "Sports",
            address: "123 Main St",
            numberOfCourses: 5,
          },
        ],
        courses: [
          {
            id: "1",
            name: "Test Course",
            categoryName: "Fitness",
            imagePath: "test.jpg",
            subscriptionCount: 10,
          },
        ],
      });
    });

    it("should handle empty results", async () => {
      // Arrange
      const filter: SearchFilter = { query: "nonexistent" };
      mockPrismaService.client.physiotherapist.findMany.mockResolvedValue([]);
      mockPrismaService.client.course.findMany.mockResolvedValue([]);

      // Act
      const result = await service.searchMatchingEntities(filter);

      // Assert
      expect(result).toEqual({
        physiotherapists: [],
        courses: [],
      });
    });

    it("should handle physiotherapist name with middle name", async () => {
      // Arrange
      const physiotherapistWithMiddleName = {
        ...mockPhysiotherapist,
        user: {
          ...mockPhysiotherapist.user,
          middleName: "Middle",
        },
      };
      const filter: SearchFilter = { query: "test" };
      mockPrismaService.client.physiotherapist.findMany.mockResolvedValue([
        physiotherapistWithMiddleName,
      ]);
      mockPrismaService.client.course.findMany.mockResolvedValue([]);

      // Act
      const result = await service.searchMatchingEntities(filter);

      // Assert
      expect(result.physiotherapists[0].fullName).toBe("John Middle Doe");
    });

    it("should handle database errors", async () => {
      // Arrange
      const filter: SearchFilter = { query: "test" };
      const error = new Error("Database error");
      mockPrismaService.client.physiotherapist.findMany.mockRejectedValue(
        error
      );

      // Act & Assert
      await expect(service.searchMatchingEntities(filter)).rejects.toThrow(
        error
      );
    });
  });

  describe("getPhysiotherapistName", () => {
    it("should format name correctly with all parts", () => {
      const user = createMockUser("Middle");
      const result = SearchService["getPhysiotherapistName"](user);
      expect(result).toBe("John Middle Doe");
    });

    it("should format name correctly without middle name", () => {
      const user = createMockUser(null);
      const result = SearchService["getPhysiotherapistName"](user);
      expect(result).toBe("John Doe");
    });
  });
});
