import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { Course, CourseLevel } from "@prisma/client";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { CourseOwnerDto } from "./course-owner.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { CourseCategoryDto } from "src/categories/dto/category.dto";

export class CourseSessionDto {
  @ApiProperty({
    description: "The id of the session",
    required: false,
  })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({ description: "Start time of the session", type: Date })
  @IsDate()
  @Expose()
  start_time: Date;

  @ApiProperty({ description: "End time of the session", type: Date })
  @IsDate()
  @Expose()
  end_time: Date;
}

export class CourseDto implements Course {
  @ApiProperty({ description: "The id of the course" })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({ description: "The name of the course" })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: "The complete description of the course" })
  @IsString()
  @Expose()
  description: string;

  @ApiProperty({ description: "A brief description of the course" })
  @IsString()
  @Expose()
  short_description: string;

  @ApiProperty({
    description: "Location where the course will be held",
    required: false,
  })
  @IsString()
  @Expose()
  @IsOptional()
  location: string | null;

  @ApiProperty({ description: "List of instructors for the course" })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  instructors: string[];

  @ApiProperty({ description: "Level of the course", enum: CourseLevel })
  @IsEnum(CourseLevel)
  @Expose()
  level: CourseLevel;

  @ApiProperty({ description: "Indicates if the course is free" })
  @IsBoolean()
  @Expose()
  is_free: boolean;

  @ApiProperty({
    description: "Price of the course",
    required: false,
    type: Number,
  })
  @Transform(({ value }) => value)
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Expose()
  price: Decimal | null;

  @ApiProperty({ description: "Amount of payment required", required: false })
  @IsNumber()
  @Expose()
  @IsOptional()
  number_of_payments: number | null;

  @ApiProperty({ description: "Indicates if the course is public" })
  @IsBoolean()
  @Expose()
  is_published: boolean;

  @ApiProperty({ description: "Indicates if subscriptions are open" })
  @IsBoolean()
  @Expose()
  subscriptions_open: boolean;

  @ApiProperty({
    description: "Amount of maximum subscribers (unlimited if null)",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  max_subscribers: number | null;

  @ApiProperty({ description: "Related tags" })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  tags: string[];

  @ApiProperty({ description: "Date of creation" })
  @IsDate()
  @Expose()
  created_at: Date;

  @ApiProperty({ description: "Date of last update" })
  @IsDate()
  @Expose()
  updated_at: Date;

  @ApiProperty({ description: "The owner of the course" })
  @Type(() => CourseOwnerDto)
  @Expose()
  owner: CourseOwnerDto;

  @Exclude()
  @ApiHideProperty()
  owner_id: string;

  @ApiProperty({ description: "The category of the course" })
  @Type(() => CourseCategoryDto)
  @Expose()
  category: CourseCategoryDto;

  @ApiHideProperty()
  @Exclude()
  category_id: string;

  @ApiProperty({
    description: "The sessions of the course",
    required: true,
    type: [CourseSessionDto],
  })
  @IsArray()
  @Type(() => CourseSessionDto)
  @Expose()
  sessions: CourseSessionDto[];

  @ApiProperty({
    description: "Subscription start date",
    required: true,
  })
  @IsDate()
  @Expose()
  subscription_start_date: Date;

  @ApiProperty({
    description: "Subscription end date",
    required: true,
  })
  @IsDate()
  @Expose()
  subscription_end_date: Date;
}
