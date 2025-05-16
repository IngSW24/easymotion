import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CourseDto, CourseSessionDto } from "./course.dto";
import { Expose, Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class CreateCourseSessionDto extends OmitType(CourseSessionDto, [
  "id",
]) {}

export class CreateCourseDto extends OmitType(CourseDto, [
  "id",
  "created_at",
  "updated_at",
  "current_subscribers",
  "owner",
  "owner_id",
  "category",
  "sessions",
  "category_id",
  "image_path",
]) {
  @ApiProperty({ description: "id of the existent category" })
  @IsString()
  @Expose()
  category_id: string;

  @ApiProperty({ required: true, type: [CreateCourseSessionDto] })
  @IsArray()
  @Type(() => CreateCourseSessionDto)
  @Expose()
  sessions: CreateCourseSessionDto[];
}
