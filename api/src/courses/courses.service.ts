import { Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCoursesDto } from "./dto/update-course.dto";
import { CourseEntity } from "./dto/course.dto";
import { PrismaService } from "nestjs-prisma";
import { PaginatedOutput } from "src/common/dto/paginated-output.dto";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { CrudService } from "src/common/abstractions/crud-service.interface";
import { plainToInstance } from "class-transformer";
import { CourseSubcriberDto } from "./dto/course-subcriber.dto";
import { toPaginatedOutput } from "src/common/utils/pagination";

@Injectable()
/**
 * CoursesService provides CRUD operations for managing courses.
 * It implements the CrudService interface, ensuring a consistent structure
 * for Create, Read, Update, and Delete operations.
 */
export class CoursesService
  implements CrudService<CreateCourseDto, UpdateCoursesDto, CourseEntity>
{
  /**
   * Constructor injects the PrismaService for database access.
   * @param prismaService - Service to interact with the Prisma Client.
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new course in the database.
   * @param data - Data Transfer Object (DTO) containing the course details.
   * @returns The newly created course mapped to a DTO.
   */
  async create(data: CreateCourseDto) {
    const course = await this.prismaService.course.create({
      data: { ...(data as any) },
    });

    return plainToInstance(CourseEntity, course);
  }

  /**
   * Retrieves all courses with pagination.
   * @param pagination - Pagination filter containing the page and perPage parameters.
   * @returns A paginated output with course data and metadata.
   */
  async findAll(
    pagination: PaginationFilter
  ): Promise<PaginatedOutput<CourseEntity>> {
    const { page, perPage } = pagination;

    const count = await this.prismaService.course.count();

    const courses = await this.prismaService.course.findMany({
      skip: page * perPage,
      take: perPage,
    });

    return toPaginatedOutput(
      courses.map((x) => plainToInstance(CourseEntity, x)),
      count,
      pagination
    );
  }

  /**
   * Subscribes a final user to a course.
   * @param finalUserId Unique identifier of the final user.
   * @param courseId Unique identifier of the course.
   */
  async subscribeFinalUser(finalUserId: string, courseId: string) {
    const user = await this.prismaService.finalUser.findUnique({
      where: { applicationUserId: finalUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    await this.prismaService.courseFinalUser.create({
      data: {
        course_id: course.id,
        final_user_id: finalUserId,
      },
    });
  }

  /**
   * Unsubscribes a final user from a course.
   * @param finalUserId Unique identifier of the final user.
   * @param courseId Unique identifier of the course.
   */
  async unsubscribeFinalUser(finalUserId: string, courseId: string) {
    await this.prismaService.courseFinalUser.deleteMany({
      where: { course_id: courseId, final_user_id: finalUserId },
    });
  }

  /**
   * Retrieves all subscribers to a course with pagination.
   * @param courseId Unique identifier of the course.
   * @param pagination Pagination filter containing the page and perPage parameters.
   * @returns A paginated output with subscriber data and metadata.
   */
  async getCourseSubscriptions(courseId: string, pagination: PaginationFilter) {
    const count = await this.prismaService.courseFinalUser.count({
      where: { course_id: courseId },
    });

    const paginatedSubscribers =
      await this.prismaService.courseFinalUser.findMany({
        where: { course_id: courseId },
        include: {
          final_user: {
            include: { applicationUser: true },
          },
        },
        skip: pagination.page * pagination.perPage,
        take: pagination.perPage,
      });

    return toPaginatedOutput(
      paginatedSubscribers.map((x) => ({
        ...plainToInstance(CourseSubcriberDto, x.final_user.applicationUser, {
          excludeExtraneousValues: true,
        }),
        subscriptionDate: x.created_at,
      })),
      count,
      pagination
    );
  }

  /**
   * Finds a single course by its ID.
   * @param id - Unique identifier of the course.
   * @returns The course mapped to a DTO.
   * @throws NotFoundException if the course is not found.
   */
  async findOne(id: string) {
    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(CourseEntity, course);
  }

  /**
   * Updates an existing course by its ID.
   * @param id - Unique identifier of the course.
   * @param data - Data Transfer Object (DTO) containing the updated course details.
   * @returns The updated course mapped to a DTO.
   */
  async update(id: string, data: UpdateCoursesDto) {
    const updatedCourse = await this.prismaService.course.update({
      where: { id },
      data: { ...(data as any) },
    });

    return plainToInstance(CourseEntity, updatedCourse);
  }

  /**
   * Removes a course from the database by its ID.
   * @param id - Unique identifier of the course.
   */
  async remove(id: string) {
    await this.prismaService.course.delete({
      where: { id },
    });
  }
}
