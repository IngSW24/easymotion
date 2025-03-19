import { Injectable, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "nestjs-prisma";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { toPaginatedOutput } from "src/common/utils/pagination";
import { CourseEntity } from "src/courses/dto/course.dto";
import { CourseSubcriberDto } from "./dto/course-subcriber.dto";

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCustomerSubscriptions(
    customerId: string,
    pagination: PaginationFilter
  ) {
    const count = await this.prismaService.courseFinalUser.count({
      where: { final_user_id: customerId },
    });

    const courses = await this.prismaService.courseFinalUser.findMany({
      where: { final_user_id: customerId },
      include: { course: true },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    return toPaginatedOutput(
      courses.map((x) => plainToInstance(CourseEntity, x.course)),
      count,
      pagination
    );
  }

  /**
   * Subscribes a final user to a course.
   * @param finalUserId Unique identifier of the final user.
   * @param courseId Unique identifier of the course.
   */
  async subscribeFinalUser(finalUserId: string, courseId: string) {
    const user = await this.prismaService.finalUser.findUnique({
      where: { applicationUserId: finalUserId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    await this.prismaService.courseFinalUser.create({
      data: {
        course_id: course.id,
        final_user_id: finalUserId,
      },
    });
  }

  /**
   * Unsubscribes a final user from a course.
   * @param finalUserId Unique identifier of the final user.
   * @param courseId Unique identifier of the course.
   */
  async unsubscribeFinalUser(finalUserId: string, courseId: string) {
    await this.prismaService.courseFinalUser.deleteMany({
      where: { course_id: courseId, final_user_id: finalUserId },
    });
  }

  /**
   * Retrieves all subscribers to a course with pagination.
   * @param courseId Unique identifier of the course.
   * @param pagination Pagination filter containing the page and perPage parameters.
   * @returns A paginated output with subscriber data and metadata.
   */
  async getCourseSubscriptions(courseId: string, pagination: PaginationFilter) {
    const count = await this.prismaService.courseFinalUser.count({
      where: { course_id: courseId },
    });

    const paginatedSubscribers =
      await this.prismaService.courseFinalUser.findMany({
        where: { course_id: courseId },
        include: {
          final_user: {
            include: { applicationUser: true },
          },
        },
        skip: pagination.page * pagination.perPage,
        take: pagination.perPage,
      });

    return toPaginatedOutput(
      paginatedSubscribers.map((x) => ({
        ...plainToInstance(CourseSubcriberDto, x.final_user.applicationUser, {
          excludeExtraneousValues: true,
        }),
        subscriptionDate: x.created_at,
      })),
      count,
      pagination
    );
  }
}
