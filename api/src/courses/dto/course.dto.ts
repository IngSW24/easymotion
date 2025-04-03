import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  CourseCategory,
  CourseAvailability,
  CourseFrequency,
  CourseLevel,
  Prisma,
} from "@prisma/client";
import { Expose, Transform, Type } from "class-transformer";
import { CourseOwnerDto } from "./course-owner.dto";

export class CourseEntity {
  @ApiProperty({ description: "Unique identifier for the course" })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({ description: "Name of the course" })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: "Full description of the course" })
  @IsString()
  @Expose()
  description: string;

  @ApiProperty({ description: "Short description of the course" })
  @IsString()
  @Expose()
  short_description: string;

  @ApiProperty({ description: "Location where the course is held (optional)" })
  @IsOptional()
  @IsString()
  @Expose()
  location?: string;

  @ApiProperty({ description: "Schedule of course session days" })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  schedule: string[];

  @ApiProperty({ description: "Array of user IDs of instructors" })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  instructors: string[];

  @ApiProperty({ description: "Category of the course", enum: CourseCategory })
  @IsEnum(CourseCategory)
  @Expose()
  category: CourseCategory;

  @ApiProperty({ description: "Level of the course", enum: CourseLevel })
  @IsEnum(CourseLevel)
  @Expose()
  level: CourseLevel;

  @ApiProperty({
    description: "Frequency of the course",
    enum: CourseFrequency,
  })
  @IsEnum(CourseFrequency)
  @Expose()
  frequency: CourseFrequency;

  @ApiProperty({ description: "Duration of each session in POSIX format" })
  @IsString()
  @Expose()
  session_duration: string;

  @ApiProperty({
    description: "Cost of the course (optional)",
    required: false,
    type: "number",
  })
  @Transform(({ value }) => value)
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Expose()
  cost?: Prisma.Decimal;

  @ApiProperty({
    description: "Discount for the course (optional)",
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Expose()
  discount?: number;

  @ApiProperty({
    description: "Availability status of the course",
    enum: CourseAvailability,
  })
  @IsEnum(CourseAvailability)
  @Expose()
  availability: CourseAvailability;

  @ApiProperty({
    description: "Priority level for highlighting the course (optional)",
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Expose()
  highlighted_priority?: number;

  @ApiProperty({
    description: "Maximum capacity of course members (optional)",
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Expose()
  members_capacity?: number;

  @ApiProperty({ description: "Number of registered members", default: 0 })
  @IsInt()
  @IsPositive()
  @Expose()
  num_registered_members: number;

  @ApiProperty({ description: "Tags associated with the course" })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  tags: string[];

  @ApiProperty({
    description: "Path to the thumbnail image for the course (optional)",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Expose()
  thumbnail_path?: string;

  @IsDate()
  @Expose()
  created_at: Date;

  @IsDate()
  @Expose()
  updated_at: Date;

  @ApiProperty({ description: "Owner of the course" })
  @Expose()
  @Type(() => CourseOwnerDto)
  owner: CourseOwnerDto;

  constructor(partial: Partial<CourseEntity>) {
    Object.assign(this, partial);
  }
}
