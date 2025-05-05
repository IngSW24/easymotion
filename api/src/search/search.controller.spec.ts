import { Test, TestingModule } from "@nestjs/testing";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { SearchFilter } from "./dto/search-filter.dto";
import { SearchResult } from "./dto/search-result.dto";

describe("SearchController", () => {
  let controller: SearchController;
  let searchService: SearchService;

  const mockSearchService = {
    searchMatchingEntities: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("searchPhysiotherapist", () => {
    it("should return search results", async () => {
      // Arrange
      const mockFilter: SearchFilter = { query: "test" };
      const mockResult: SearchResult = {
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
      };

      mockSearchService.searchMatchingEntities.mockResolvedValue(mockResult);

      // Act
      const result = await controller.searchPhysiotherapist(mockFilter);

      // Assert
      expect(result).toEqual(mockResult);
      expect(searchService.searchMatchingEntities).toHaveBeenCalledWith(
        mockFilter
      );
    });

    it("should handle empty search results", async () => {
      // Arrange
      const mockFilter: SearchFilter = { query: "nonexistent" };
      const mockResult: SearchResult = {
        physiotherapists: [],
        courses: [],
      };

      mockSearchService.searchMatchingEntities.mockResolvedValue(mockResult);

      // Act
      const result = await controller.searchPhysiotherapist(mockFilter);

      // Assert
      expect(result).toEqual(mockResult);
      expect(searchService.searchMatchingEntities).toHaveBeenCalledWith(
        mockFilter
      );
    });

    it("should handle service errors", async () => {
      // Arrange
      const mockFilter: SearchFilter = { query: "test" };
      const error = new Error("Search failed");
      mockSearchService.searchMatchingEntities.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.searchPhysiotherapist(mockFilter)
      ).rejects.toThrow(error);
      expect(searchService.searchMatchingEntities).toHaveBeenCalledWith(
        mockFilter
      );
    });
  });
});
