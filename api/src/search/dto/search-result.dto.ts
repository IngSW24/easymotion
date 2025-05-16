import { Expose, Type } from "class-transformer";
import { IsArray } from "class-validator";
import { SearchPhysiotherapistDto } from "./search-physiotherapist.dto";
import { SearchCourseDto } from "./search-course.dto";

export class SearchResultDto {
  @IsArray()
  @Type(() => SearchPhysiotherapistDto)
  @Expose()
  physiotherapists: SearchPhysiotherapistDto[];

  @IsArray()
  @Type(() => SearchCourseDto)
  @Expose()
  courses: SearchCourseDto[];
}
