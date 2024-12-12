import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export enum CourseTypeEnum {
  AUTONOMOUS = 'autonomous',
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export class CourseEntity {
  @ApiProperty({ description: 'Unique identifier for the course' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Organizer of the course' })
  @IsString()
  organizer: string;

  @ApiProperty({ description: 'Instructor leading the course' })
  @IsString()
  instructor: string;

  @ApiProperty({
    description: 'Type of the course',
    enum: CourseType,
    enumName: 'CourseType',
    example: CourseTypeEnum.AUTONOMOUS,
  })
  @IsEnum(CourseType, {
    message:
      'type must have one of these values: ' +
      Object.values(CourseType).join(', '),
  })
  @IsString()
  type: CourseType;

  @ApiPropertyOptional({ description: 'Scheduled times for the course' })
  @IsOptional()
  @IsString()
  times?: string;

  @ApiPropertyOptional({ description: 'Detailed description of the course' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Location where the course will take place',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Frequency of the course (e.g., weekly)',
  })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiPropertyOptional({
    description: 'Cost of the course',
    example: 50.0,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  cost: number;

  constructor(partial: Partial<CourseEntity>) {
    Object.assign(this, partial);

    if (Decimal.isDecimal(this.cost)) {
      this.cost = this.cost.toNumber();
    }
  }
}
