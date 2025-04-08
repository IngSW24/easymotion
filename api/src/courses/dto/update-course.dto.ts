import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateCourseDto, CreateCourseSessionDto } from "./create-course.dto";
import { IsArray, IsOptional, IsUUID } from "class-validator";
import { Type } from "class-transformer";
export class UpdateCourseSessionDto extends CreateCourseSessionDto {
  @ApiProperty({
    description:
      "The id of the session to update if the session exists already",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class UpdateCourseDto extends PartialType(
  OmitType(CreateCourseDto, ["sessions"])
) {
  @IsOptional()
  @IsArray()
  @Type(() => UpdateCourseSessionDto)
  sessions?: UpdateCourseSessionDto[];
}
