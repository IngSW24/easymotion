import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Course, CourseLevel, PaymentRecurrence } from "@prisma/client";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { CourseOwnerDto } from "./course-owner.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { CourseCategoryDto } from "src/categories/dto/category.dto";

export class CourseSessionDto {
  @ApiProperty({ description: "The id of the session" })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({ description: "Start time of the session", type: Date })
  @IsDate()
  @Expose()
  startTime: Date;

  @ApiProperty({ description: "End time of the session", type: Date })
  @IsDate()
  @Expose()
  endTime: Date;
}

export class CourseDto implements Course {
  @ApiProperty({ description: "The id of the course" })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({ description: "The image path of the course" })
  @IsString()
  @Expose()
  imagePath: string | null;

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
  shortDescription: string;

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

  @ApiProperty({
    description: "Price of the course",
    type: Number,
  })
  @Transform(({ value }) => value)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Expose()
  price: Decimal;

  @ApiProperty({
    description: "Payment recurrence",
    enum: PaymentRecurrence,
  })
  @IsEnum(PaymentRecurrence)
  @Expose()
  paymentRecurrence: PaymentRecurrence;

  @ApiProperty({ description: "Indicates if the course is public" })
  @IsBoolean()
  @Expose()
  isPublished: boolean;

  @ApiProperty({ description: "Indicates if subscriptions are open" })
  @IsBoolean()
  @Expose()
  subscriptionsOpen: boolean;

  @ApiProperty({
    description: "Amount of maximum subscribers (unlimited if null)",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  maxSubscribers: number | null;

  @ApiProperty({
    description: "Current subscribers (count)",
  })
  @IsNumber()
  @IsDefined()
  @Expose()
  currentSubscribers: number;

  @ApiProperty({ description: "Related tags" })
  @IsArray()
  @IsString({ each: true })
  @Expose()
  tags: string[];

  @ApiProperty({ description: "Date of creation" })
  @IsDate()
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: "Date of last update" })
  @IsDate()
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: "The owner of the course" })
  @Type(() => CourseOwnerDto)
  @Expose()
  owner: CourseOwnerDto;

  @Exclude()
  @ApiHideProperty()
  ownerId: string;

  @ApiProperty({ description: "The category of the course" })
  @Type(() => CourseCategoryDto)
  @Expose()
  category: CourseCategoryDto;

  @ApiHideProperty()
  @Exclude()
  categoryId: string;

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
  @IsDateString() // TODO: use IsDateString() because it does not use class-transformer Type(()=>Date)
  @Expose()
  subscriptionStartDate: Date;

  @ApiProperty({
    description: "Subscription end date",
    required: true,
  })
  @IsDateString()
  @Expose()
  subscriptionEndDate: Date;
}
