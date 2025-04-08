import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CourseDto, CourseSessionDto } from "./course.dto";
import { Expose, Type } from "class-transformer";
import { IsArray, IsUUID } from "class-validator";

export class CreateCourseSessionDto extends OmitType(CourseSessionDto, [
  "id",
]) {}

export class CreateCourseDto extends OmitType(CourseDto, [
  "id",
  "created_at",
  "updated_at",
  "owner",
  "owner_id",
  "category",
  "sessions",
  "category_id",
]) {
  @ApiProperty({ description: "id of the existent category" })
  @IsUUID()
  @Expose()
  category_id: string;

  @ApiProperty({ required: true, type: [CreateCourseSessionDto] })
  @IsArray()
  @Type(() => CreateCourseSessionDto)
  @Expose()
  sessions: CreateCourseSessionDto[];
}
