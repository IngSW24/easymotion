import { Api } from "../client/Api";

export type PaginatedCourse = Awaited<
  ReturnType<typeof Api.prototype.courses.coursesControllerFindAll>
>;
