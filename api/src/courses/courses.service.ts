import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CourseDto } from "./dto/course.dto";
import { PrismaService } from "nestjs-prisma";
import { PaginatedOutput } from "src/common/dto/paginated-output.dto";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { CourseQueryFilter } from "./dto/filters/course-query-filter.dto";
import { CourseLevel, Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import IAssetsService, { ASSETS_SERVICE } from "src/assets/assets.interface";
import { toPaginatedOutput } from "src/common/prisma/pagination";

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
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(ASSETS_SERVICE) private readonly assetsService: IAssetsService
  ) {}

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
        shortDescription: newCourse.shortDescription,
        location: newCourse.location,
        instructors: newCourse.instructors,
        level: newCourse.level,
        price: newCourse.price,
        paymentRecurrence: newCourse.paymentRecurrence,
        isPublished: newCourse.isPublished,
        subscriptionsOpen: newCourse.subscriptionsOpen,
        maxSubscribers: newCourse.maxSubscribers,
        tags: newCourse.tags,
        subscriptionStartDate: newCourse.subscriptionStartDate,
        subscriptionEndDate: newCourse.subscriptionEndDate, // TODO: use three dot notation
        sessions: {
          create: newCourse.sessions,
        },
        category: {
          connect: { id: newCourse.categoryId },
        },
        owner: {
          connect: { userId: ownerId },
        },
      },
      include: {
        owner: { include: { user: true } },
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

    return this.prismaService.$transaction(async (tx) => {
      const count = await tx.course.count();

      const categoryIds = filter.categoryIds?.split(",");

      const courses = await tx.course.findMany({
        skip: page * perPage,
        take: perPage,
        where: {
          ...(onlyPublished && { isPublished: true }),
          ...(filter?.ownerId && {
            owner: {
              user: {
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
              user: true,
            },
          },
          category: true,
          sessions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return toPaginatedOutput(
        await Promise.all(
          courses.map(async (course) =>
            plainToInstance(CourseDto, {
              ...course,
              owner: course.owner.user,
              currentSubscribers: await tx.subscription.count({
                where: { courseId: course.id },
              }),
            })
          )
        ),
        count,
        pagination
      );
    });
  }

  /**
   * Finds a single course by its ID.
   * @param id - Unique identifier of the course.
   * @returns The course mapped to a DTO.
   * @throws NotFoundException if the course is not found.
   */
  async findOne(id: string): Promise<CourseDto> {
    return this.prismaService.$transaction(async (tx) => {
      const course = await tx.course.findUniqueOrThrow({
        where: { id },
        include: {
          owner: {
            include: { user: true },
          },
          sessions: true,
          category: true,
        },
      });

      return {
        ...course,
        owner: course.owner.user,
        currentSubscribers: await tx.subscription.count({
          where: { courseId: id },
        }),
      };
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
    delete cleanUpdates.categoryId;

    const data: Prisma.CourseUpdateInput = {
      ...cleanUpdates,
      ...(updates.categoryId && {
        category: {
          connect: { id: updates.categoryId },
        },
      }),
    };

    if (updates.sessions) {
      // get all existing session IDs for this course
      const existingSessions = await this.prismaService.courseSession.findMany({
        where: { courseId: courseId },
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
            startTime: session.startTime,
            endTime: session.endTime,
          },
        })),
        create: sessionsToCreate,
      };
    }

    const updatedCourse = await this.prismaService.course.update({
      where: { id: courseId },
      data,
      include: {
        owner: { include: { user: true } },
        category: true,
        sessions: true,
      },
    });

    return plainToInstance(CourseDto, {
      ...updatedCourse,
      owner: updatedCourse.owner.user,
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
   * Sets the image path for a course.
   * @param id - Unique identifier of the course.
   * @param imagePath - The path to the image file.
   */
  setImagePath(id: string, imagePath: string | null) {
    return this.prismaService.course.update({
      where: { id },
      data: { imagePath: imagePath },
    });
  }

  async updateImage(
    id: string,
    buffer: Buffer,
    mimeType: string,
    uniqueTimestamp: string | number | null = null
  ) {
    const course = await this.findOne(id);

    const timestamp = uniqueTimestamp ?? DateTime.utc().toMillis().toString();

    const fileName = `${course.id}-${timestamp}`;

    if (course.imagePath) {
      await this.assetsService.deleteFile(course.imagePath);
    }

    const imagePath = await this.assetsService.uploadBuffer(
      buffer,
      "course",
      fileName,
      mimeType
    );

    if (!imagePath) {
      throw new BadRequestException("Failed to upload image!");
    }

    await this.setImagePath(id, imagePath);

    return { ...course, imagePath: imagePath };
  }

  /**
   * Get all subscribers for a course
   * @param courseId the id of the course
   * @returns all subscribers for the course
   */
  getCourseSubscribers(courseId: string) {
    return this.prismaService.subscription.findMany({
      where: { courseId: courseId },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
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
    return this.prismaService.$transaction(async (tx) => {
      const count = await tx.subscription.count({
        where: { patientId: userId, isPending: false },
      });

      const courses = await tx.subscription.findMany({
        where: {
          AND: [
            { isPending: false },
            { patientId: userId },
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
                ? { categoryId: { in: filters.categoryIds.split(",") } }
                : {}),
              ...(filters.level ? { level: filters.level } : {}),
            },
          ],
        },
        include: {
          course: {
            include: {
              owner: {
                include: { user: true },
              },
              category: true,
            },
          },
        },
        skip: pagination.page * pagination.perPage,
        take: pagination.perPage,
      });

      return toPaginatedOutput(
        await Promise.all(
          courses.map(async (x) =>
            plainToInstance(CourseDto, {
              ...x.course,
              owner: x.course.owner.user,
              currentSubscribers: await tx.subscription.count({
                where: { courseId: x.courseId },
              }),
            })
          )
        ),
        count,
        pagination
      );
    });
  }
}
