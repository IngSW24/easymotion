import {
  BadRequestException,
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
import { SubscriptionDto, UserSubscriptionDto } from "./dto/subscription.dto";
import { Role } from "@prisma/client";

@Controller("subscriptions")
@UseAuth()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * Get the current subscriptions for the logged user
   */
  @ApiPaginatedResponse(SubscriptionDto)
  @Get()
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
  @ApiPaginatedResponse(SubscriptionDto)
  @Get(":userId")
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
   * Subscribe the logged in final user to a course
   * @param courseId the course uuid
   */
  @Post()
  @ApiOkResponse()
  subscribe(@Body() subscriptionCreateDto: SubscriptionCreateDto, @Req() req) {
    const role = req.user.role;

    if (role === Role.USER) {
      return this.subscriptionsService.subscribeFinalUser(
        req.user.sub,
        subscriptionCreateDto
      );
    }

    if (!subscriptionCreateDto.userId)
      throw new BadRequestException(
        "userId is required for physiotherapists and admins"
      );

    return this.subscriptionsService.subscribeFinalUser(
      subscriptionCreateDto.userId,
      subscriptionCreateDto
    );
  }

  /**
   * Unsubscribe the logged in final user from a course
   * @param courseId the course uuid
   */
  @Delete()
  @ApiOkResponse()
  unsubscribe(
    @Body() subscriptionDeleteDto: SubscriptionDeleteDto,
    @Req() req
  ) {
    const role = req.user.role;

    if (role === Role.USER) {
      return this.subscriptionsService.unsubscribeFinalUser(
        req.user.sub,
        subscriptionDeleteDto
      );
    }

    if (!subscriptionDeleteDto.userId)
      throw new BadRequestException(
        "userId is required for physiotherapists and admins"
      );

    return this.subscriptionsService.unsubscribeFinalUser(
      subscriptionDeleteDto.userId,
      subscriptionDeleteDto
    );
  }

  /**
   * Gets all subscribers of a course
   * @param courseId the course uuid
   */
  @Get("course/:courseId")
  @ApiPaginatedResponse(UserSubscriptionDto)
  getSubscribers(
    @Param("courseId") courseId: string,
    @Query() pagination: PaginationFilter
  ) {
    return this.subscriptionsService.getCourseSubscriptions(
      courseId,
      pagination
    );
  }
}
