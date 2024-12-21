/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  CourseEntity,
  CreateCourseDto,
  UpdateCoursesDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Courses<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Courses
   * @name CoursesControllerCreate
   * @summary Create a new course
   * @request POST:/courses
   */
  coursesControllerCreate = (
    data: CreateCourseDto,
    params: RequestParams = {}
  ) =>
    this.request<CourseEntity, any>({
      path: `/courses`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Courses
   * @name CoursesControllerFindAll
   * @summary Find all courses
   * @request GET:/courses
   */
  coursesControllerFindAll = (
    query?: {
      /** @default 0 */
      page?: number;
      /** @default 10 */
      perPage?: number;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      {
        data: CourseEntity[];
      } & {
        meta: {
          items: number;
          hasNextPage: boolean;
          currentPage: number;
          totalItems: number;
          totalPages: number;
        };
      },
      any
    >({
      path: `/courses`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Courses
   * @name CoursesControllerFindOne
   * @summary Find a course by its id
   * @request GET:/courses/{id}
   */
  coursesControllerFindOne = (id: string, params: RequestParams = {}) =>
    this.request<CourseEntity, any>({
      path: `/courses/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Courses
   * @name CoursesControllerUpdate
   * @summary Update a course by its id
   * @request PUT:/courses/{id}
   */
  coursesControllerUpdate = (
    id: string,
    data: UpdateCoursesDto,
    params: RequestParams = {}
  ) =>
    this.request<CourseEntity, any>({
      path: `/courses/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Courses
   * @name CoursesControllerRemove
   * @summary Delete a course by its id
   * @request DELETE:/courses/{id}
   */
  coursesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/courses/${id}`,
      method: "DELETE",
      ...params,
    });
}
