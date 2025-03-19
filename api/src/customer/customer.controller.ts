import { Controller, Get, Query, Req } from "@nestjs/common";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { CustomerService } from "./customer.service";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import { CourseEntity } from "src/courses/dto/course.dto";

@Controller("customer")
@UseAuth(["user"])
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiPaginatedResponse(CourseEntity)
  @Get("subscriptions")
  getSubscriptions(@Req() req, @Query() pagination: PaginationFilter) {
    return this.customerService.getCustomerSubscriptions(
      req.user.id,
      pagination
    );
  }
}
