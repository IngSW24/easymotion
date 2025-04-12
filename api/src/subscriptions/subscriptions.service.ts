import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
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
    subscriptionCreateDto: SubscriptionCreateDto,
    forceSubscribe: boolean = false
  ) {
    const user = await this.prismaService.finalUser.findUniqueOrThrow({
      where: { applicationUserId: finalUserId },
    });

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: subscriptionCreateDto.courseId },
    });

    if (!forceSubscribe) {
      const numExistingSubscriptions =
        await this.prismaService.courseFinalUser.count({
          where: {
            course_id: course.id,
          },
        });

      if (
        numExistingSubscriptions >= course.max_subscribers ||
        !course.subscriptions_open
      ) {
        throw new BadRequestException("Course is full");
      }
    }

    const now = new Date();
    if (
      now.getTime() < course.subscription_start_date.getTime() ||
      now.getTime() > course.subscription_end_date.getTime()
    ) {
      throw new ForbiddenException("Subscriptions closed");
    }

    await this.prismaService.courseFinalUser.create({
      data: {
        course_id: course.id,
        final_user_id: user.applicationUserId,
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
