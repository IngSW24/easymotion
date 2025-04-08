import { ApiProperty } from "@nestjs/swagger";
import { CourseCategory } from "@prisma/client";
import { Expose } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

export class CourseCategoryDto implements CourseCategory {
  @ApiProperty({ description: "The name of the course category" })
  @Expose()
  @IsString()
  name: string;

  @ApiProperty({ description: "The id of the course category" })
  @Expose()
  @IsUUID()
  id: string;
}
