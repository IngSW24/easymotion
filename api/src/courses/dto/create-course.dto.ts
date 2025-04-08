import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CourseDto } from "./course.dto";
import { Expose, Type } from "class-transformer";
import { IsArray, IsDate, IsUUID } from "class-validator";

export class CreateCourseSessionDto {
  @ApiProperty({ description: "Start time of the session" })
  @IsDate()
  @Expose()
  start_time: Date;

  @ApiProperty({ description: "End time of the session" })
  @IsDate()
  @Expose()
  end_time: Date;
}

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
