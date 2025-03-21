import { Injectable, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "nestjs-prisma";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { toPaginatedOutput } from "src/common/utils/pagination";
import { SubscriptionCreateDto } from "./dto/subscription-create.dto";
import { SubscriptionDeleteDto } from "./dto/subscription-delete.dto";
import { SubscriptionDto, UserSubscriptionDto } from "./dto/subscription.dto";

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
      courses.map((x) =>
        plainToInstance(
          SubscriptionDto,
          {
            course: x.course,
            subscriptionDate: x.created_at,
          },
          { excludeExtraneousValues: true }
        )
      ),
      count,
      pagination
    );
  }

  /**
   * Subscribes a final user to a course.
   * @param finalUserId Unique identifier of the final user.
   * @param courseId Unique identifier of the course.
   */
  async subscribeFinalUser(
    finalUserId: string,
    subscriptionCreateDto: SubscriptionCreateDto
  ) {
    const user = await this.prismaService.finalUser.findUnique({
      where: { applicationUserId: finalUserId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: subscriptionCreateDto.courseId },
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
  async unsubscribeFinalUser(
    finalUserId: string,
    subscriptionDeleteDto: SubscriptionDeleteDto
  ) {
    await this.prismaService.courseFinalUser.deleteMany({
      where: {
        course_id: subscriptionDeleteDto.courseId,
        final_user_id: finalUserId,
      },
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
          course: { select: { id: true, name: true } },
        },
        skip: pagination.page * pagination.perPage,
        take: pagination.perPage,
      });

    return toPaginatedOutput(
      paginatedSubscribers.map((x) =>
        plainToInstance(
          UserSubscriptionDto,
          {
            course: x.course,
            user: x.final_user.applicationUser,
            subscriptionDate: x.created_at,
          },
          { excludeExtraneousValues: true }
        )
      ),
      count,
      pagination
    );
  }
}
