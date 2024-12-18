import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCoursesDto } from './dto/update-course.dto';
import { CourseEntity } from './entities/course.entity';
import { Course } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginatedOutput } from 'src/common/dto/paginated-output.dto';
import { PaginationFilter } from 'src/common/dto/pagination-filter.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateCourseDto) {
    const course = await this.prismaService.course.create({
      data: { ...(data as any) },
    });

    return this.mapToDto(course);
  }

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
      data: this.mapToDto(courses), // Array of mapped courses
      meta: {
        currentPage: page,
        items: courses.length,
        hasNextPage: (page + 1) * perPage < count,
        totalItems: count,
        totalPages: Math.ceil(count / perPage),
      },
    };
  }

  async findOne(id: string) {
    const course = await this.prismaService.course.findUniqueOrThrow({
      where: { id },
    });

    return this.mapToDto(course);
  }

  async update(id: string, data: UpdateCoursesDto) {
    const updatedCourse = await this.prismaService.course.update({
      where: { id },
      data: { ...(data as any) },
    });

    return this.mapToDto(updatedCourse);
  }

  async remove(id: string) {
    await this.prismaService.course.delete({
      where: { id },
    });
  }

  private mapToDto<T extends Course | Course[]>(course: T): MapOutput<T> {
    if (Array.isArray(course)) {
      return course.map(
        (x) => new CourseEntity({ ...x, cost: x.cost?.toNumber() }),
      ) as MapOutput<T>;
    }

    return new CourseEntity({
      ...course,
      cost: course.cost?.toNumber(),
    }) as MapOutput<T>;
  }
}

type MapOutput<T> = T extends Course[] ? CourseEntity[] : CourseEntity;
