import { Api } from "@mui/icons-material";

export type PaginatedCourse = Awaited<
  ReturnType<typeof Api.prototype.courses.coursesControllerFindAll>
>;
