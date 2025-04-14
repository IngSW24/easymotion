import { BadRequestException, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "nestjs-prisma";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { toPaginatedOutput } from "src/common/utils/pagination";
import { SubscriptionCreateDto } from "./dto/subscription-create.dto";
import {
  SubscriptionDtoWithCourse,
  SubscriptionDtoWithUser,
} from "./dto/subscription.dto";

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCustomerSubscriptions(
    customerId: string,
    pagination: PaginationFilter
  ) {
    const count = await this.prismaService.subscription.count({
      where: { patient_id: customerId },
    });

    const courses = await this.prismaService.subscription.findMany({
      where: { patient_id: customerId, isPending: false },
      include: { course: { select: { id: true, name: true } } },
      orderBy: { course: { name: "asc" } },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    return toPaginatedOutput(
      courses.map((subscription) =>
        plainToInstance(
          SubscriptionDtoWithCourse,
          {
            ...subscription,
            course: subscription.course,
          },
          { excludeExtraneousValues: true }
        )
      ),
      count,
      pagination
    );
  }

  /**
   * Retrieves all subscribers to a course with pagination.
   * @param courseId Unique identifier of the course.
   * @param pagination Pagination filter containing the page and perPage parameters.
   * @returns A paginated output with subscriber data and metadata.
   */
  async getCourseSubscriptions(
    pagination: PaginationFilter,
    isPending: boolean,
    courseId?: string
  ) {
    const count = await this.prismaService.subscription.count({
      where: { course_id: courseId },
    });

    const paginatedSubscribers = await this.prismaService.subscription.findMany(
      {
        where: { course_id: courseId, isPending },
        include: {
          patient: { include: { applicationUser: true } },
          course: { select: { id: true, name: true } },
        },
        orderBy: { patient: { applicationUser: { firstName: "asc" } } },
        skip: pagination.page * pagination.perPage,
        take: pagination.perPage,
      }
    );

    return toPaginatedOutput(
      paginatedSubscribers.map((subscription) =>
        plainToInstance(
          SubscriptionDtoWithUser,
          {
            ...subscription,
            course: subscription.course,
            user: subscription.patient.applicationUser,
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
    patient_id: string,
    subscriptionCreateDto: SubscriptionCreateDto,
    byPatient: boolean = false
  ) {
    const user = await this.prismaService.patient.findUniqueOrThrow({
      where: { applicationUserId: patient_id },
    });

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: subscriptionCreateDto.course_id },
    });

    if (byPatient) {
      const numExistingSubscriptions =
        await this.prismaService.subscription.count({
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

      const now = new Date();
      if (
        now.getTime() < course.subscription_start_date.getTime() ||
        now.getTime() > course.subscription_end_date.getTime()
      ) {
        throw new BadRequestException("Subscriptions closed");
      }

      await this.prismaService.subscription.create({
        data: {
          course_id: course.id,
          patient_id: user.applicationUserId,
          isPending: true,
        },
      });
      return;
    }

    await this.prismaService.subscription.upsert({
      create: {
        course_id: course.id,
        patient_id: user.applicationUserId,
        isPending: false,
      },
      update: {
        isPending: false,
      },
      where: {
        course_id_patient_id: {
          course_id: course.id,
          patient_id: user.applicationUserId,
        },
      },
    });
  }

  /**
   * Unsubscribes a final user from a course.
   * @param finalUserId Unique identifier of the final user.
   * @param courseId Unique identifier of the course.
   */
  async unsubscribeFinalUser(patientId: string, courseId: string) {
    await this.prismaService.subscription.deleteMany({
      where: {
        course_id: courseId,
        patient_id: patientId,
      },
    });
  }
}
