import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CourseDto, CourseSessionDto } from "./course.dto";
import { Expose, Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class CreateCourseSessionDto extends OmitType(CourseSessionDto, [
  "id",
]) {}

export class CreateCourseDto extends OmitType(CourseDto, [
  "id",
  "createdAt",
  "updatedAt",
  "currentSubscribers",
  "owner",
  "ownerId",
  "category",
  "sessions",
  "categoryId",
  "imagePath",
]) {
  @ApiProperty({ description: "id of the existent category" })
  @IsString()
  @Expose()
  categoryId: string;

  @ApiProperty({ required: true, type: [CreateCourseSessionDto] })
  @IsArray()
  @Type(() => CreateCourseSessionDto)
  @Expose()
  sessions: CreateCourseSessionDto[];
}
