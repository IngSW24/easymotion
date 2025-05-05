import { Inject, Injectable } from "@nestjs/common";
import {
  EXTENDED_PRISMA_SERVICE,
  ExtendedPrismaService,
} from "src/common/prisma/pagination";
import { SearchFilter } from "./dto/search-filter.dto";
import { ApplicationUser } from "@prisma/client";
import { SearchResultDto } from "./dto/search-result.dto";

@Injectable()
export class SearchService {
  constructor(
    @Inject(EXTENDED_PRISMA_SERVICE)
    private readonly prisma: ExtendedPrismaService
  ) {}

  /**
   * Search for matching entities based on the query.
   * @param filter - The search filter containing the query.
   * @returns The matching entities.
   */
  async searchMatchingEntities(filter: SearchFilter) {
    const { query } = filter;

    const [physiotherapists, courses] = await Promise.all([
      this.searchPhysiotherapists(query),
      this.searchCourses(query),
    ]);

    const result: SearchResultDto = {
      physiotherapists: physiotherapists.map((physiotherapist) => ({
        id: physiotherapist.applicationUser.id,
        fullName: SearchService.getPhysiotherapistName(
          physiotherapist.applicationUser
        ),
        address: physiotherapist.publicAddress,
        specialization: physiotherapist.specialization,
        numberOfCourses: physiotherapist._count.courses,
        picturePath: physiotherapist.applicationUser.picturePath,
      })),
      courses: courses.map((course) => ({
        id: course.id,
        name: course.name,
        subscriptionCount: course._count.subscriptions,
        categoryName: course.category.name,
        imagePath: course.image_path,
      })),
    };

    return result;
  }

  private static getPhysiotherapistName(user: ApplicationUser) {
    return [user.firstName, user.middleName, user.lastName]
      .filter(Boolean)
      .join(" ");
  }

  /**
   * Search for physiotherapists that match the query.
   * @param query - The query to search for.
   * @param limit - The maximum number of results to return.
   * @returns The physiotherapists that match the query.
   */
  private searchPhysiotherapists(query: string, limit: number = 10) {
    return this.prisma.client.physiotherapist.findMany({
      include: {
        applicationUser: true,
        _count: {
          select: { courses: true },
        },
      },
      where: {
        AND: [
          {
            applicationUser: {
              isEmailVerified: true,
            },
            OR: [
              {
                applicationUser: {
                  OR: [
                    { firstName: { contains: query, mode: "insensitive" } },
                    { middleName: { contains: query, mode: "insensitive" } },
                    { lastName: { contains: query, mode: "insensitive" } },
                  ],
                },
              },
              {
                specialization: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                applicationUser: {
                  email: { contains: query, mode: "insensitive" },
                },
              },
            ],
          },
        ],
      },
      take: limit,
    });
  }

  /**
   * Search for courses that match the query.
   * @param query - The query to search for.
   * @param limit - The maximum number of results to return.
   * @returns The courses that match the query.
   */
  private searchCourses(query: string, limit: number = 10) {
    return this.prisma.client.course.findMany({
      include: {
        category: true,
        _count: {
          select: { subscriptions: true },
        },
      },
      where: {
        AND: [
          {
            is_published: true,
          },
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                short_description: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      take: limit,
    });
  }
}
