import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "nestjs-prisma";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { toPaginatedOutput } from "src/common/utils/pagination";
import { CourseEntity } from "src/courses/dto/course.dto";

@Injectable()
export class CustomerService {
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
      courses.map((x) => plainToInstance(CourseEntity, x.course)),
      count,
      pagination
    );
  }
}
