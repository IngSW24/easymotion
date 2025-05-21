import {
  IsArray,
  IsBoolean,
  IsDate,
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
  @Type(() => Date)
  @Expose()
  startTime: Date;

  @ApiProperty({ description: "End time of the session", type: Date })
  @IsDate()
  @Type(() => Date)
  @Expose()
  endTime: Date;
}

export class CourseDto implements Course {
  @ApiProperty({ description: "The id of the course" })
  @IsString()
  @IsDefined()
  @Expose()
  id: string;

  @ApiProperty({ description: "The image path of the course" })
  @IsString()
  @IsDefined()
  @Expose()
  imagePath: string | null;

  @ApiProperty({ description: "The name of the course" })
  @IsString()
  @IsDefined()
  @Expose()
  name: string;

  @ApiProperty({ description: "The complete description of the course" })
  @IsString()
  @IsDefined()
  @Expose()
  description: string;

  @ApiProperty({ description: "A brief description of the course" })
  @IsString()
  @IsDefined()
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
  @IsDefined()
  @Expose()
  instructors: string[];

  @ApiProperty({ description: "Level of the course", enum: CourseLevel })
  @IsEnum(CourseLevel)
  @IsDefined()
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
  @IsDefined()
  @Expose()
  price: Decimal;

  @ApiProperty({
    description: "Payment recurrence",
    enum: PaymentRecurrence,
  })
  @IsEnum(PaymentRecurrence)
  @IsDefined()
  @Expose()
  paymentRecurrence: PaymentRecurrence;

  @ApiProperty({ description: "Indicates if the course is public" })
  @IsBoolean()
  @IsDefined()
  @Expose()
  isPublished: boolean;

  @ApiProperty({ description: "Indicates if subscriptions are open" })
  @IsBoolean()
  @IsDefined()
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
  @IsDefined()
  @Expose()
  tags: string[];

  @ApiProperty({ description: "Date of creation" })
  @IsDate()
  @Type(() => Date)
  @IsDefined()
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: "Date of last update" })
  @IsDate()
  @Type(() => Date)
  @IsDefined()
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: "The owner of the course" })
  @Type(() => CourseOwnerDto)
  @IsDefined()
  @Expose()
  owner: CourseOwnerDto;

  @Exclude()
  @IsDefined()
  @ApiHideProperty()
  ownerId: string;

  @ApiProperty({ description: "The category of the course" })
  @Type(() => CourseCategoryDto)
  @IsDefined()
  @Expose()
  category: CourseCategoryDto;

  @ApiHideProperty()
  @IsDefined()
  @Exclude()
  categoryId: string;

  @ApiProperty({
    description: "The sessions of the course",
    required: true,
    type: [CourseSessionDto],
  })
  @IsArray()
  @Type(() => CourseSessionDto)
  @IsDefined()
  @Expose()
  sessions: CourseSessionDto[];

  @ApiProperty({
    description: "Subscription start date",
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @IsDefined()
  @Expose()
  subscriptionStartDate: Date;

  @ApiProperty({
    description: "Subscription end date",
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @IsDefined()
  @Expose()
  subscriptionEndDate: Date;
}
