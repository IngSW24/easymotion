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
  Inject,
  BadRequestException,
  ParseFilePipeBuilder,
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
import IAssetsService, { ASSETS_SERVICE } from "src/assets/assets.interface";
import { ImageCompressionService } from "src/assets/image-compression.service";
import { DateTime } from "luxon";

@Controller("courses")
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly imageCompressionService: ImageCompressionService,
    @Inject(ASSETS_SERVICE)
    private readonly assetsService: IAssetsService
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
  update(@Param("id") id: string, @Body() updateCoursesDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCoursesDto);
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

    const fileName = `${id}-${DateTime.now().toMillis()}`;

    const imagePath = await this.assetsService.uploadBuffer(
      compressedBuffer,
      "course",
      fileName,
      file.mimetype
    );

    if (!imagePath) {
      throw new BadRequestException("Failed to upload image!");
    }

    await this.coursesService.setImagePath(id, imagePath);

    return this.coursesService.findOne(id);
  }
}
