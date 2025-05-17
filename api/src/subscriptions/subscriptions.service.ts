import { BadRequestException, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "nestjs-prisma";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { toPaginatedOutput } from "src/common/prisma/pagination";
import {
  SubscriptionDtoWithCourse,
  SubscriptionDtoWithUser,
} from "./dto/subscription.dto";

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Retrieves subscriptions for a specific customer with pagination.
   * @param customerId Unique identifier of the customer.
   * @param pagination Pagination filter containing the page and perPage parameters.
   * @param isPending Whether to return pending subscriptions only.
   * @returns A paginated output with subscription data and metadata.
   */
  async getCustomerSubscriptions(
    customerId: string,
    pagination: PaginationFilter,
    isPending: boolean = false
  ) {
    const count = await this.prismaService.subscription.count({
      where: { patientId: customerId, isPending },
    });

    const courses = await this.prismaService.subscription.findMany({
      where: { patientId: customerId, isPending },
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
   * @param pagination Pagination filter containing the page and perPage parameters.
   * @param courseId Unique identifier of the course.
   * @param isPending Whether to return pending subscriptions only.
   * @returns A paginated output with subscriber data and metadata.
   */
  async getCourseSubscriptions(
    pagination: PaginationFilter,
    courseId: string,
    isPending: boolean = false
  ) {
    const count = await this.prismaService.subscription.count({
      where: { courseId: courseId, isPending },
    });

    const paginatedSubscribers = await this.prismaService.subscription.findMany(
      {
        where: { courseId: courseId, isPending },
        include: {
          patient: { include: { user: true } },
          course: { select: { id: true, name: true } },
        },
        orderBy: { patient: { user: { firstName: "asc" } } },
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
            user: subscription.patient.user,
          },
          { excludeExtraneousValues: true }
        )
      ),
      count,
      pagination
    );
  }

  /**
   * Creates a subscription request from a patient to a course.
   * @param patientId Unique identifier of the patient.
   * @param courseId Unique identifier of the course.
   * @throws BadRequestException if course is full or subscriptions are closed.
   */
  async createSubscriptionRequest(patientId: string, courseId: string) {
    const user = await this.prismaService.patient.findUniqueOrThrow({
      where: { userId: patientId },
    });

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: courseId },
    });

    const numExistingSubscriptions =
      await this.prismaService.subscription.count({
        where: {
          courseId: course.id,
        },
      });

    if (
      numExistingSubscriptions >= course.maxSubscribers ||
      !course.subscriptionsOpen
    ) {
      throw new BadRequestException("Course is full");
    }

    const now = new Date();
    if (
      now.getTime() < course.subscriptionStartDate.getTime() ||
      now.getTime() > course.subscriptionEndDate.getTime()
    ) {
      throw new BadRequestException("Subscriptions closed");
    }

    await this.prismaService.subscription.create({
      data: {
        courseId: course.id,
        patientId: user.userId,
        isPending: true,
      },
    });
  }

  /**
   * Creates a direct subscription for a patient to a course (admin action).
   * @param patientId Unique identifier of the patient.
   * @param courseId Unique identifier of the course.
   */
  async createDirectSubscription(patientId: string, courseId: string) {
    const user = await this.prismaService.patient.findUniqueOrThrow({
      where: { userId: patientId },
    });

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: courseId },
    });

    await this.prismaService.subscription.upsert({
      create: {
        courseId: course.id,
        patientId: user.userId,
        isPending: false,
      },
      update: {
        isPending: false,
      },
      where: {
        courseId_patientId: {
          courseId: course.id,
          patientId: user.userId,
        },
      },
    });
  }

  /**
   * Accepts a pending subscription request.
   * @param patientId Unique identifier of the patient.
   * @param courseId Unique identifier of the course.
   * @throws BadRequestException if no pending subscription exists.
   */
  async acceptSubscriptionRequest(patientId: string, courseId: string) {
    const subscription = await this.prismaService.subscription.findUnique({
      where: {
        courseId_patientId: {
          courseId,
          patientId,
        },
      },
    });

    if (!subscription) {
      throw new BadRequestException("Subscription request not found");
    }

    if (!subscription.isPending) {
      throw new BadRequestException("Subscription is already active");
    }

    await this.prismaService.subscription.update({
      where: {
        courseId_patientId: {
          courseId,
          patientId,
        },
      },
      data: {
        isPending: false,
      },
    });
  }

  /**
   * Unsubscribes a patient from a course.
   * @param patientId Unique identifier of the patient.
   * @param courseId Unique identifier of the course.
   */
  async unsubscribeFinalUser(patientId: string, courseId: string) {
    await this.prismaService.subscription.deleteMany({
      where: {
        courseId: courseId,
        patientId: patientId,
      },
    });
  }
}
