import { Body, Controller, Get, Param, Put, Query, Req } from "@nestjs/common";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { SubscriptionsService } from "./subscriptions.service";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import { CourseEntity } from "src/courses/dto/course.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { UserIdDto } from "src/common/dto/user-id.dto";
import { CourseSubcriberDto } from "./dto/course-subcriber.dto";

@Controller("subscriptions")
@UseAuth(["user"])
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * Get the current subscriptions for the final user logged in
   */
  @ApiPaginatedResponse(CourseEntity)
  @Get("current")
  getSubscriptions(@Req() req, @Query() pagination: PaginationFilter) {
    return this.subscriptionsService.getCustomerSubscriptions(
      req.user.sub,
      pagination
    );
  }

  /**
   * Subscribe the logged in final user to a course
   * @param courseId the course uuid
   */
  @Put("subscribe/:courseId")
  @ApiOkResponse()
  subscribe(@Param("courseId") courseId: string, @Req() req) {
    return this.subscriptionsService.subscribeFinalUser(req.user.sub, courseId);
  }

  /**
   * Subscribe the given final user id to a course (only for physiotherapist and admin)
   * @param courseId the course uuid
   */
  @Put("subscribe-user/:courseId")
  @ApiOkResponse()
  @UseAuth(["physiotherapist", "admin"])
  subscribeUser(
    @Param("courseId") courseId: string,
    @Body() userIdDto: UserIdDto
  ) {
    return this.subscriptionsService.subscribeFinalUser(
      userIdDto.userId,
      courseId
    );
  }

  /**
   * Unsubscribe the logged in final user from a course
   * @param courseId the course uuid
   */
  @Put("unsubscribe/:courseId")
  @ApiOkResponse()
  @UseAuth(["user"])
  unsubscribe(@Param("courseId") courseId: string, @Req() req) {
    return this.subscriptionsService.unsubscribeFinalUser(
      req.user.sub,
      courseId
    );
  }

  /**
   * Unsubscribe the given final user id from a course (only for physiotherapists and admins)
   * @param courseId the course uuid
   */
  @Put("unsubscribe-user/:courseId")
  @ApiOkResponse()
  @UseAuth(["physiotherapist", "admin"])
  unsubscribeUser(
    @Param("courseId") courseId: string,
    @Body() userIdDto: UserIdDto
  ) {
    return this.subscriptionsService.unsubscribeFinalUser(
      userIdDto.userId,
      courseId
    );
  }

  /**
   * Gets all subscribers of a course
   * @param courseId the course uuid
   */
  @Get("subscribers/:courseId")
  @ApiPaginatedResponse(CourseSubcriberDto)
  @UseAuth()
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
