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
} from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCoursesDto } from "./dto/update-course.dto";
import { CourseEntity } from "./dto/course.dto";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { Role } from "@prisma/client";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Create a new course
   * @param createCourseDto the course to create
   * @returns the created course
   */
  @Post()
  @UseAuth([Role.PHYSIOTHERAPIST])
  @ApiCreatedResponse({ type: CourseEntity })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  /**
   * Find all courses
   * @returns all courses
   */
  @Get()
  @ApiPaginatedResponse(CourseEntity)
  findAll(@Query() pagination: PaginationFilter) {
    return this.coursesService.findAll(pagination);
  }

  /**
   * Find all courses to which the logged user is subscribed
   * @returns all courses
   */
  @Get("/subscribed")
  @UseAuth([Role.USER])
  @ApiPaginatedResponse(CourseEntity)
  findSubscribedCourses(@Query() pagination: PaginationFilter, @Req() req) {
    return this.coursesService.findSubscribedCourses(req.user.sub, pagination);
  }

  /**
   * Find all courses to which the given user is subscribed
   * @returns all courses
   */
  @Get("/subscribed/:userId")
  @UseAuth()
  @ApiPaginatedResponse(CourseEntity)
  findSubscribedCoursesForUserId(
    @Query() pagination: PaginationFilter,
    @Param("userId") userId: string
  ) {
    return this.coursesService.findSubscribedCourses(userId, pagination);
  }

  /**
   * Find a course by its id
   * @param id the course uuid
   * @returns the course with the given id
   */
  @Get(":id")
  @ApiOkResponse({ type: CourseEntity })
  findOne(@Param("id") id: string) {
    return this.coursesService.findOne(id);
  }

  /**
   * Update a course by its id
   * @param id the course uuid
   * @param updateCoursesDto fields to update
   * @returns the updated course
   */
  @Put(":id")
  @ApiOkResponse({ type: CourseEntity })
  @UseAuth([Role.PHYSIOTHERAPIST])
  update(@Param("id") id: string, @Body() updateCoursesDto: UpdateCoursesDto) {
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
}
