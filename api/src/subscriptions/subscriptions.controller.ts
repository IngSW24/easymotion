import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { SubscriptionsService } from "./subscriptions.service";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  SubscriptionCreateDto,
  SubscriptionRequestDto,
} from "./dto/subscription-create.dto";
import { SubscriptionDeleteDto } from "./dto/subscription-delete.dto";
import {
  SubscriptionDtoWithCourse,
  SubscriptionDtoWithUser,
} from "./dto/subscription.dto";
import { Role } from "@prisma/client";
import { EmailService } from "src/email/email.service";
import { CoursesService } from "src/courses/courses.service";
import { UserManager } from "src/users/user.manager";

@ApiTags("Subscriptions")
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly emailService: EmailService,
    private readonly coursesService: CoursesService,
    private readonly usersManager: UserManager
  ) {}

  /**
   * Get the current active subscriptions for the logged user
   */
  @Get()
  @UseAuth()
  @ApiPaginatedResponse(SubscriptionDtoWithCourse)
  getSubscriptionsForLoggedUser(
    @Query() pagination: PaginationFilter,
    @Req() req
  ) {
    return this.subscriptionsService.getCustomerSubscriptions(
      req.user.sub,
      pagination,
      false
    );
  }

  /**
   * Get the pending subscriptions for the logged user
   */
  @Get("pending")
  @UseAuth()
  @ApiPaginatedResponse(SubscriptionDtoWithCourse)
  getPendingSubscriptionsForLoggedUser(
    @Query() pagination: PaginationFilter,
    @Req() req
  ) {
    return this.subscriptionsService.getCustomerSubscriptions(
      req.user.sub,
      pagination,
      true
    );
  }

  /**
   * Send a subscription request to a course
   */
  @Post("request")
  @UseAuth()
  @ApiOkResponse()
  async sendSubscriptionRequest(
    @Body() subscriptionRequestDto: SubscriptionRequestDto,
    @Req() req
  ) {
    await this.subscriptionsService.createSubscriptionRequest(
      req.user.sub,
      subscriptionRequestDto.courseId
    );
  }

  /**
   * [ADMIN & PHYSIOTHERAPIST] Get the active subscriptions for a specific user
   */
  @Get(":userId")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiPaginatedResponse(SubscriptionDtoWithCourse)
  getSubscriptionsForGivenUser(
    @Param("userId") userId: string,
    @Query() pagination: PaginationFilter
  ) {
    return this.subscriptionsService.getCustomerSubscriptions(
      userId,
      pagination,
      false
    );
  }

  /**
   * [ADMIN & PHYSIOTHERAPIST] Get the pending subscriptions for a specific user
   */
  @Get(":userId/pending")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiPaginatedResponse(SubscriptionDtoWithCourse)
  getPendingSubscriptionsForGivenUser(
    @Param("userId") userId: string,
    @Query() pagination: PaginationFilter
  ) {
    return this.subscriptionsService.getCustomerSubscriptions(
      userId,
      pagination,
      true
    );
  }

  /**
   * [ADMIN & PHYSIOTHERAPIST] Get many active subscribers for a course
   */
  @Get("course/:courseId")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiPaginatedResponse(SubscriptionDtoWithUser)
  getSubscribersForCourse(
    @Param("courseId") courseId: string,
    @Query() pagination: PaginationFilter
  ) {
    return this.subscriptionsService.getCourseSubscriptions(
      pagination,
      courseId,
      false
    );
  }

  /**
   * [ADMIN & PHYSIOTHERAPIST] Get many pending subscribers for a course
   */
  @Get("course/:courseId/pending")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiPaginatedResponse(SubscriptionDtoWithUser)
  getPendingSubscribersForCourse(
    @Param("courseId") courseId: string,
    @Query() pagination: PaginationFilter
  ) {
    return this.subscriptionsService.getCourseSubscriptions(
      pagination,
      courseId,
      true
    );
  }

  /**
   * [ADMIN & PHYSIOTHERAPIST] Accept a pending subscription request
   */
  @Put("request/accept")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiOkResponse()
  async acceptSubscriptionRequest(
    @Body() subscriptionCreateDto: SubscriptionCreateDto
  ) {
    await this.subscriptionsService.acceptSubscriptionRequest(
      subscriptionCreateDto.patientId,
      subscriptionCreateDto.courseId
    );

    const course = await this.coursesService.findOne(
      subscriptionCreateDto.courseId
    );

    const user = await this.usersManager.getUserById(
      subscriptionCreateDto.patientId
    );

    await this.emailService.sendEmail(
      user.email,
      "Richiesta di iscrizione accettata",
      `La tua richiesta di iscrizione al corso ${course.name} è stata accettata.`
    );
  }

  /**
   * [ADMIN & PHYSIOTHERAPIST] Create a direct subscription for a user to a course
   */
  @Post()
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiOkResponse()
  async createSubscription(
    @Body() subscriptionCreateDto: SubscriptionCreateDto
  ) {
    await this.subscriptionsService.createDirectSubscription(
      subscriptionCreateDto.patientId,
      subscriptionCreateDto.courseId
    );

    const course = await this.coursesService.findOne(
      subscriptionCreateDto.courseId
    );

    const patient = await this.usersManager.getUserById(
      subscriptionCreateDto.patientId
    );

    await this.emailService.sendEmail(
      course.owner.email,
      "Nuova iscrizione al corso",
      `Il paziente ${subscriptionCreateDto.patientId} è stato iscritto al corso ${course.name}.`
    );

    await this.emailService.sendEmail(
      patient.email,
      "Iscrizione al corso",
      `Sei stato iscritto al corso ${course.name}.`
    );
  }

  /**
   * [ADMIN & PHYSIOTHERAPIST] Delete a subscription for a user from a course
   */
  @Delete()
  @ApiOkResponse()
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  async deleteSubscription(
    @Body() subscriptionDeleteDto: SubscriptionDeleteDto
  ) {
    await this.subscriptionsService.unsubscribeFinalUser(
      subscriptionDeleteDto.patientId,
      subscriptionDeleteDto.courseId
    );

    const course = await this.coursesService.findOne(
      subscriptionDeleteDto.courseId
    );

    const patient = await this.usersManager.getUserById(
      subscriptionDeleteDto.patientId
    );

    await this.emailService.sendEmail(
      patient.email,
      "Rimozione dal corso",
      `Sei stato rimosso dal corso ${course.name}.`
    );
  }
}
