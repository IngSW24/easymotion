import { Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CourseDto } from "./dto/course.dto";
import { PrismaService } from "nestjs-prisma";
import { PaginatedOutput } from "src/common/dto/paginated-output.dto";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { toPaginatedOutput } from "src/common/utils/pagination";
import { CourseQueryFilter } from "./dto/filters/course-query-filter.dto";
import { CourseLevel, Prisma } from "@prisma/client";

@Injectable()
/**
 * CoursesService provides CRUD operations for managing courses.
 * It implements the CrudService interface, ensuring a consistent structure
 * for Create, Read, Update, and Delete operations.
 */
export class CoursesService {
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
  async create(newCourse: CreateCourseDto, ownerId: string) {
    const course = await this.prismaService.course.create({
      data: {
        name: newCourse.name,
        description: newCourse.description,
        short_description: newCourse.short_description,
        location: newCourse.location,
        instructors: newCourse.instructors,
        level: newCourse.level,
        price: newCourse.price,
        payment_recurrence: newCourse.payment_recurrence,
        is_published: newCourse.is_published,
        subscriptions_open: newCourse.subscriptions_open,
        max_subscribers: newCourse.max_subscribers,
        tags: newCourse.tags,
        subscription_start_date: newCourse.subscription_start_date,
        subscription_end_date: newCourse.subscription_end_date, // TODO: use three dot notation
        sessions: {
          create: newCourse.sessions,
        },
        category: {
          connect: { id: newCourse.category_id },
        },
        owner: {
          connect: { applicationUserId: ownerId },
        },
      },
      include: {
        owner: { include: { applicationUser: true } },
        category: true,
        sessions: true,
      },
    });

    return plainToInstance(CourseDto, course);
  }

  /**
   * Retrieves all courses with pagination.
   * @param pagination - Pagination filter containing the page and perPage parameters.
   * @returns A paginated output with course data and metadata.
   */
  async findAll(
    pagination: PaginationFilter,
    filter: CourseQueryFilter,
    onlyPublished: boolean = false
  ): Promise<PaginatedOutput<CourseDto>> {
    const { page, perPage } = pagination;

    const count = await this.prismaService.course.count();

    const categoryIds = filter.categoryIds?.split(",");

    const courses = await this.prismaService.course.findMany({
      skip: page * perPage,
      take: perPage,
      where: {
        ...(onlyPublished && { is_published: true }),
        ...(filter?.ownerId && {
          owner: {
            applicationUser: {
              id: filter.ownerId,
            },
          },
        }),
        ...(filter?.searchText && {
          name: {
            contains: filter.searchText,
            mode: "insensitive",
          },
        }),
        ...(categoryIds && {
          category: {
            id: {
              in: categoryIds,
            },
          },
        }),
        ...(filter?.level && {
          level: filter.level as CourseLevel,
        }),
      },

      include: {
        owner: {
          include: {
            applicationUser: true,
          },
        },
        category: true,
        sessions: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return toPaginatedOutput(
      courses.map((x) =>
        plainToInstance(CourseDto, { ...x, owner: x.owner.applicationUser })
      ),
      count,
      pagination
    );
  }

  async findAllByPhysiotherapist(
    physioId: string,
    pagination: PaginationFilter
  ) {
    const count = await this.prismaService.course.count({
      where: { owner_id: physioId },
    });

    const courses = await this.prismaService.course.findMany({
      where: { owner_id: physioId },
      include: {
        owner: {
          include: { applicationUser: true },
        },
        category: true,
        sessions: true,
      },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    return toPaginatedOutput(
      courses.map((x) =>
        plainToInstance(CourseDto, { ...x, owner: x.owner.applicationUser })
      ),
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
      include: {
        owner: {
          include: { applicationUser: true },
        },
        sessions: true,
        category: true,
      },
    });

    return plainToInstance(CourseDto, {
      ...course,
      owner: course.owner.applicationUser,
    });
  }

  /**
   * Updates an existing course by its ID.
   * @param id - Unique identifier of the course.
   * @param data - Data Transfer Object (DTO) containing the updated course details.
   * @returns The updated course mapped to a DTO.
   */
  async update(courseId: string, updates: UpdateCourseDto) {
    const sessionsToUpdate = updates.sessions?.filter((s) => s.id) ?? [];
    const sessionsToCreate = updates.sessions?.filter((s) => !s.id) ?? [];

    const cleanUpdates = instanceToPlain(updates, {
      exposeUnsetFields: false,
    });

    delete cleanUpdates.sessions;
    delete cleanUpdates.category_id;

    const data: Prisma.CourseUpdateInput = {
      ...cleanUpdates,
      ...(updates.category_id && {
        category: {
          connect: { id: updates.category_id },
        },
      }),
    };

    if (updates.sessions) {
      // get all existing session IDs for this course
      const existingSessions = await this.prismaService.courseSession.findMany({
        where: { course_id: courseId },
        select: { id: true },
      });

      const existingIds = existingSessions.map((s) => s.id);
      const updateIds = sessionsToUpdate.map((s) => s.id);
      const idsToDelete = existingIds.filter((id) => !updateIds.includes(id));

      data.sessions = {
        deleteMany: idsToDelete.map((id) => ({ id })),
        updateMany: sessionsToUpdate.map((session) => ({
          where: { id: session.id },
          data: {
            start_time: session.start_time,
            end_time: session.end_time,
          },
        })),
        create: sessionsToCreate,
      };
    }

    const updatedCourse = await this.prismaService.course.update({
      where: { id: courseId },
      data,
      include: {
        owner: { include: { applicationUser: true } },
        category: true,
        sessions: true,
      },
    });

    return plainToInstance(CourseDto, {
      ...updatedCourse,
      owner: updatedCourse.owner.applicationUser,
    });
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

  /**
   * Find courses to which the given userId is subscribed
   * @param userId the id of the logged in user
   * @param pagination the pagination filter
   */
  async findSubscribedCourses(
    userId: string,
    pagination: PaginationFilter,
    filters: CourseQueryFilter
  ) {
    const count = await this.prismaService.subscription.count({
      where: { patient_id: userId },
    });

    const courses = await this.prismaService.subscription.findMany({
      where: {
        AND: [
          { patient_id: userId },
          {
            ...(filters.searchText
              ? {
                  OR: [
                    {
                      course: {
                        name: {
                          contains: filters.searchText,
                          mode: "insensitive",
                        },
                      },
                    },
                    {
                      course: {
                        description: {
                          contains: filters.searchText,
                          mode: "insensitive",
                        },
                      },
                    },
                  ],
                }
              : {}),
            ...(filters.categoryIds
              ? { category_id: { in: filters.categoryIds.split(",") } }
              : {}),
            ...(filters.level ? { level: filters.level } : {}),
          },
        ],
      },
      include: {
        course: {
          include: {
            owner: {
              include: { applicationUser: true },
            },
            category: true,
          },
        },
      },
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });

    return toPaginatedOutput(
      courses.map((x) =>
        plainToInstance(CourseDto, {
          ...x.course,
          owner: x.course.owner.applicationUser,
        })
      ),
      count,
      pagination
    );
  }
}
