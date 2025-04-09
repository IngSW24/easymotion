import { OmitType } from "@nestjs/swagger";
import { CourseCategoryDto } from "./category.dto";

export class CreateCourseCategoryDto extends OmitType(CourseCategoryDto, [
  "id",
]) {}
