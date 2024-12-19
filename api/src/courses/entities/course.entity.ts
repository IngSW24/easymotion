import {
  IsArray,
  IsDate,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CourseCategory,
  CourseAvailability,
  CourseFrequency,
  CourseLevel,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class CourseEntity {
  @ApiProperty({ description: 'Unique identifier for the course' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Name of the course' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Full description of the course' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Short description of the course' })
  @IsString()
  short_description: string;

  @ApiProperty({ description: 'Location where the course is held (optional)' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Schedule of course session days' })
  @IsArray()
  @IsString({ each: true })
  schedule: string[];

  @ApiProperty({ description: 'Array of user IDs of instructors' })
  @IsArray()
  @IsString({ each: true })
  instructors: string[];

  @ApiProperty({ description: 'Category of the course', enum: CourseCategory })
  @IsEnum(CourseCategory)
  category: CourseCategory;

  @ApiProperty({ description: 'Level of the course', enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({
    description: 'Frequency of the course',
    enum: CourseFrequency,
  })
  @IsEnum(CourseFrequency)
  frequency: CourseFrequency;

  @ApiProperty({ description: 'Duration of each session in POSIX format' })
  @IsString()
  session_duration: string;

  @ApiProperty({
    description: 'Cost of the course (optional)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost?: number;

  @ApiProperty({
    description: 'Discount for the course (optional)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  discount?: number;

  @ApiProperty({
    description: 'Availability status of the course',
    enum: CourseAvailability,
  })
  @IsEnum(CourseAvailability)
  availability: CourseAvailability;

  @ApiProperty({
    description: 'Priority level for highlighting the course (optional)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  highlighted_priority?: number;

  @ApiProperty({
    description: 'Maximum capacity of course members (optional)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  members_capacity?: number;

  @ApiProperty({ description: 'Number of registered members', default: 0 })
  @IsInt()
  @IsPositive()
  num_registered_members: number;

  @ApiProperty({ description: 'Tags associated with the course' })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'Path to the thumbnail image for the course (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail_path?: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  constructor(partial: Partial<CourseEntity>) {
    Object.assign(this, partial);

    if (Decimal.isDecimal(this.cost)) {
      this.cost = this.cost.toNumber();
    }
  }
}
