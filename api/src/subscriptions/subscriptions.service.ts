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
      where: { patient_id: customerId, isPending },
    });

    const courses = await this.prismaService.subscription.findMany({
      where: { patient_id: customerId, isPending },
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
      where: { course_id: courseId, isPending },
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
   * Creates a subscription request from a patient to a course.
   * @param patient_id Unique identifier of the patient.
   * @param course_id Unique identifier of the course.
   * @throws BadRequestException if course is full or subscriptions are closed.
   */
  async createSubscriptionRequest(patient_id: string, course_id: string) {
    const user = await this.prismaService.patient.findUniqueOrThrow({
      where: { applicationUserId: patient_id },
    });

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: course_id },
    });

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
  }

  /**
   * Creates a direct subscription for a patient to a course (admin action).
   * @param patient_id Unique identifier of the patient.
   * @param course_id Unique identifier of the course.
   */
  async createDirectSubscription(patient_id: string, course_id: string) {
    const user = await this.prismaService.patient.findUniqueOrThrow({
      where: { applicationUserId: patient_id },
    });

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: course_id },
    });

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
   * Accepts a pending subscription request.
   * @param patient_id Unique identifier of the patient.
   * @param course_id Unique identifier of the course.
   * @throws BadRequestException if no pending subscription exists.
   */
  async acceptSubscriptionRequest(patient_id: string, course_id: string) {
    const subscription = await this.prismaService.subscription.findUnique({
      where: {
        course_id_patient_id: {
          course_id,
          patient_id,
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
        course_id_patient_id: {
          course_id,
          patient_id,
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
        course_id: courseId,
        patient_id: patientId,
      },
    });
  }
}
