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
import { SubscriptionDto, UserSubscriptionDto } from "./dto/subscription.dto";
import { Role } from "@prisma/client";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * Get the current subscriptions for the logged user
   */
  @ApiPaginatedResponse(SubscriptionDto)
  @UseAuth([Role.USER])
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
  @UseAuth()
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
  @UseAuth([Role.USER])
  @ApiOkResponse()
  subscribeLoggedUser(
    @Body() subscriptionCreateDto: SubscriptionCreateDto,
    @Req() req
  ) {
    return this.subscriptionsService.subscribeFinalUser(
      req.user.sub,
      subscriptionCreateDto,
      true
    );
  }

  /**
   * Subscribe the given final user to a course (for admins and physiotherapists)
   * @param courseId the course uuid
   */
  @Post("user")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  @ApiOkResponse()
  subscribeGivenUser(@Body() subscriptionCreateDto: SubscriptionCreateDto) {
    return this.subscriptionsService.subscribeFinalUser(
      subscriptionCreateDto.userId,
      subscriptionCreateDto,
      false
    );
  }

  /**
   * Unsubscribe the logged in final user from a course
   * @param courseId the course uuid
   */
  @Delete()
  @ApiOkResponse()
  @UseAuth([Role.USER])
  unsubscribeLoggedUser(
    @Body() subscriptionDeleteDto: SubscriptionDeleteDto,
    @Req() req
  ) {
    return this.subscriptionsService.unsubscribeFinalUser(
      req.user.sub,
      subscriptionDeleteDto
    );
  }

  /**
   * Unsubscribe the given final user from a course (for admins and physiotherapists)
   * @param courseId the course uuid
   */
  @Delete("user")
  @ApiOkResponse()
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  unsubscribeGivenUser(@Body() subscriptionDeleteDto: SubscriptionDeleteDto) {
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
  @UseAuth()
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
