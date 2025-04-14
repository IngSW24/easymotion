import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { SubscriptionsService } from "./subscriptions.service";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import { ApiOkResponse } from "@nestjs/swagger";
import { SubscriptionCreateDto } from "./dto/subscription-create.dto";
import { SubscriptionDeleteDto } from "./dto/subscription-delete.dto";
import {
  SubscriptionDtoWithCourse,
  SubscriptionDtoWithUser,
} from "./dto/subscription.dto";
import { Role } from "@prisma/client";
import { EmailService } from "src/email/email.service";
import { CoursesService } from "src/courses/courses.service";
import { UserManager } from "src/users/user.manager";
import { isSuccessResult } from "src/common/types/result";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly emailService: EmailService,
    private readonly coursesService: CoursesService,
    private readonly usersManager: UserManager
  ) {}

  /**
   * Get the current subscriptions for the logged user
   */
  @Get()
  @UseAuth([Role.USER])
  @ApiPaginatedResponse(SubscriptionDtoWithCourse)
  getSubscriptionsForLoggedUser(
    @Query() pagination: PaginationFilter,
    @Req() req
  ) {
    return this.subscriptionsService.getCustomerSubscriptions(
      req.user.sub,
      pagination
    );
  }

  /**
   * Get the current subscriptions for the given user
   */
  @Get(":userId")
  @UseAuth()
  @ApiPaginatedResponse(SubscriptionDtoWithCourse)
  getSubscriptionsForGivenUser(
    @Param("userId") userId: string,
    @Query() pagination: PaginationFilter
  ) {
    return this.subscriptionsService.getCustomerSubscriptions(
      userId,
      pagination
    );
  }

  /**
   * Gets all subscribers of a course
   * @param courseId the course uuid
   */
  @Get("course/:course_id")
  @UseAuth()
  @ApiPaginatedResponse(SubscriptionDtoWithUser)
  getSubscribers(
    @Param("course_id") course_id: string,
    @Query() pagination: PaginationFilter
  ) {
    return this.subscriptionsService.getCourseSubscriptions(
      pagination,
      course_id,
      false
    );
  }

  /**
   * Gets all pending subscribers
   * @param courseId the course uuid
   */
  @Get("course/:courseId/pending")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiPaginatedResponse(SubscriptionDtoWithUser)
  getPendingSubscribers(
    @Param("course_id") courseId: string,
    @Query() pagination: PaginationFilter
  ) {
    return this.subscriptionsService.getCourseSubscriptions(
      pagination,
      courseId,
      true
    );
  }

  /**
   * Subscribe the logged in final user to a course
   * @param courseId the course uuid
   */
  @Post()
  @UseAuth([Role.USER])
  @ApiOkResponse()
  async subscribeLoggedUser(
    @Body() subscriptionCreateDto: SubscriptionCreateDto,
    @Req() req
  ) {
    await this.subscriptionsService.subscribeFinalUser(
      req.user.sub,
      subscriptionCreateDto,
      true
    );

    const course = await this.coursesService.findOne(
      subscriptionCreateDto.course_id
    );

    await this.emailService.sendEmail(
      course.owner.email,
      "Nuova richiesta di iscrizione al corso",
      `Hai ricevuto una nuova richiesta di iscrizione al corso ${course.name}.`
    );

    await this.emailService.sendEmail(
      req.sub.email,
      "Nuova richiesta di iscrizione al corso",
      `La tua richiesta di iscrizione al corso ${course.name} è stata ricevuta. Riceverai conferma al più presto.`
    );
  }

  /**
   * Subscribe the given final user to a course (for admins and physiotherapists)
   * @param courseId the course uuid
   */
  @Post("user")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiOkResponse()
  async subscribeGivenUser(
    @Body() subscriptionCreateDto: SubscriptionCreateDto
  ) {
    await this.subscriptionsService.subscribeFinalUser(
      subscriptionCreateDto.patient_id,
      subscriptionCreateDto
    );

    const course = await this.coursesService.findOne(
      subscriptionCreateDto.course_id
    );

    const patient = await this.usersManager.getUserById(
      subscriptionCreateDto.patient_id
    );

    await this.emailService.sendEmail(
      course.owner.email,
      "Nuova iscrizione al corso",
      `Il paziente ${subscriptionCreateDto.patient_id} si è iscritto al corso ${course.name}.`
    );

    if (isSuccessResult(patient)) {
      await this.emailService.sendEmail(
        patient.data.email,
        "Iscrizione al corso",
        `Sei stato iscritto al corso ${course.name}.`
      );
    }
  }

  /**
   * Unsubscribe the logged in final user from a course
   * @param courseId the course uuid
   */
  @Delete()
  @ApiOkResponse()
  @UseAuth([Role.USER])
  async unsubscribeLoggedUser(
    @Body() subscriptionDeleteDto: SubscriptionDeleteDto,
    @Req() req
  ) {
    await this.subscriptionsService.unsubscribeFinalUser(
      req.user.sub,
      subscriptionDeleteDto.course_id
    );

    const course = await this.coursesService.findOne(
      subscriptionDeleteDto.course_id
    );

    await this.emailService.sendEmail(
      course.owner.email,
      "Iscrizione al corso",
      `Il paziente ${req.user.sub} si è disiscritto dal corso ${course.name}.`
    );
  }

  /**
   * Unsubscribe the given final user from a course (for admins and physiotherapists)
   * @param courseId the course uuid
   */
  @Delete("user")
  @ApiOkResponse()
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  async unsubscribeGivenUser(
    @Body() subscriptionDeleteDto: SubscriptionDeleteDto
  ) {
    await this.subscriptionsService.unsubscribeFinalUser(
      subscriptionDeleteDto.patient_id, // TODO: can't be null
      subscriptionDeleteDto.course_id
    );

    const course = await this.coursesService.findOne(
      subscriptionDeleteDto.course_id
    );

    const patient = await this.usersManager.getUserById(
      subscriptionDeleteDto.patient_id
    );

    if (isSuccessResult(patient)) {
      await this.emailService.sendEmail(
        patient.data.email,
        "Iscrizione al corso",
        `Sei stato rimosso dal corso ${course.name}.`
      );
    }
  }
}
