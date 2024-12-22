import { Courses } from "../../client/Courses";

export type PaginatedCourse = Awaited<
  ReturnType<typeof Courses.prototype.coursesControllerFindAll>
>;
