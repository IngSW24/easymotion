import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UploadedFile,
  ParseFilePipeBuilder,
  Inject,
  SerializeOptions,
} from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { CourseDto } from "./dto/course.dto";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { Role } from "@prisma/client";
import { CourseQueryFilter } from "./dto/filters/course-query-filter.dto";
import { ApiFileBody } from "src/common/decorators/api-file-body.decorator";
import { CompressionService } from "src/assets/utilities/compression.service";
import { EmailService } from "src/email/email.service";
import { ConfigType } from "@nestjs/config";
import frontendConfig from "src/config/frontend.config";

@Controller("courses")
@SerializeOptions({ type: CourseDto })
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly emailService: EmailService,
    private readonly imageCompressionService: CompressionService,
    @Inject(frontendConfig.KEY)
    private readonly config: ConfigType<typeof frontendConfig>
  ) {}

  /**
   * Find all courses
   * @returns all courses
   */
  @Get()
  @ApiPaginatedResponse(CourseDto)
  findAll(
    @Query() pagination: PaginationFilter,
    @Query() filters: CourseQueryFilter
  ) {
    return this.coursesService.findAll(pagination, filters, true);
  }

  @Get("physiotherapist")
  @UseAuth([Role.PHYSIOTHERAPIST])
  @ApiPaginatedResponse(CourseDto)
  findAllForPhysiotherapist(
    @Query() pagination: PaginationFilter,
    @Query() filters: CourseQueryFilter,
    @Req() req
  ) {
    return this.coursesService.findAll(
      pagination,
      { ...filters, ownerId: req.user.sub },
      false
    );
  }

  /**
   * Find all courses to which the given user is subscribed
   * @returns all courses
   */
  @Get("/subscribed/:userId")
  @UseAuth()
  @ApiPaginatedResponse(CourseDto)
  findSubscribedCoursesForUserId(
    @Query() pagination: PaginationFilter,
    @Param("userId") userId: string,
    @Query() filters: CourseQueryFilter
  ) {
    return this.coursesService.findSubscribedCourses(
      userId,
      pagination,
      filters
    );
  }

  /**
   * Find a course by its id
   * @param id the course uuid
   * @returns the course with the given id
   */
  @Get(":id")
  @ApiOkResponse({ type: CourseDto })
  findOne(@Param("id") id: string) {
    return this.coursesService.findOne(id);
  }

  /**
   * Create a new course
   * @param createCourseDto the course to create
   * @returns the created course
   */
  @Post()
  @UseAuth([Role.PHYSIOTHERAPIST])
  @ApiCreatedResponse({ type: CourseDto })
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.coursesService.create(createCourseDto, req.user.sub);
  }

  /**
   * Update a course by its id
   * @param id the course uuid
   * @param updateCoursesDto fields to update
   * @returns the updated course
   */
  @Put(":id")
  @ApiOkResponse({ type: CourseDto })
  @UseAuth([Role.PHYSIOTHERAPIST])
  async update(
    @Param("id") id: string,
    @Body() updateCoursesDto: UpdateCourseDto
  ) {
    const updatedCourse = await this.coursesService.update(
      id,
      updateCoursesDto
    );

    const subscribers = await this.coursesService.getCourseSubscribers(id);

    await Promise.allSettled(
      subscribers.map((subscriber) =>
        this.emailService.sendEmail(
          subscriber.patient.applicationUser.email,
          "Corso aggiornato",
          `Il corso ${updatedCourse.name} al quale sei iscritto è stato aggiornato.<br/>
          <a href="${this.config.url}/details/${id}">Visualizza le modifiche.</a>`
        )
      )
    );

    return updatedCourse;
  }

  /**
   * Delete a course by its id
   * @param id the course uuid
   */
  @Delete(":id")
  @ApiOkResponse()
  @UseAuth([Role.PHYSIOTHERAPIST, Role.ADMIN])
  remove(@Param("id") id: string) {
    return this.coursesService.remove(id);
  }

  /**
   * Upload a course picture
   * @param id the course uuid
   * @param file the image file
   */
  @Post(":id/picture")
  @UseAuth([Role.PHYSIOTHERAPIST, Role.ADMIN])
  @ApiOkResponse({ type: CourseDto })
  @ApiFileBody()
  async uploadCoursePicture(
    @Param("id") id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 10 })
        .addFileTypeValidator({ fileType: "image" })
        .build()
    )
    file: Express.Multer.File
  ) {
    const compressedBuffer = await this.imageCompressionService.compressImage(
      file.buffer
    );

    return this.coursesService.updateImage(id, compressedBuffer, file.mimetype);
  }
}
