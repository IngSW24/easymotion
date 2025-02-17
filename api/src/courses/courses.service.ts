import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCoursesDto } from './dto/update-course.dto';
import { CourseEntity } from './dto/course.dto';
import { PrismaService } from 'nestjs-prisma';
import { PaginatedOutput } from 'src/common/dto/paginated-output.dto';
import { PaginationFilter } from 'src/common/dto/pagination-filter.dto';
import { CrudService } from 'src/common/abstractions/crud-service.interface';
import { plainToInstance } from 'class-transformer';

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
    pagination: PaginationFilter,
  ): Promise<PaginatedOutput<CourseEntity>> {
    const { page, perPage } = pagination;

    const count = await this.prismaService.course.count();

    const courses = await this.prismaService.course.findMany({
      skip: page * perPage,
      take: perPage,
    });

    return {
      data: courses.map((x) => plainToInstance(CourseEntity, x)), // Array of mapped courses
      meta: {
        currentPage: page,
        items: courses.length,
        hasNextPage: (page + 1) * perPage < count,
        totalItems: count,
        totalPages: Math.ceil(count / perPage),
      },
    };
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
