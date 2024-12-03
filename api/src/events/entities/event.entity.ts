import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export enum EventTypeEnum {
  AUTONOMOUS = 'autonomous',
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export class EventEntity {
  @ApiProperty({ description: 'Unique identifier for the event' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Organizer of the event' })
  @IsString()
  organizer: string;

  @ApiProperty({ description: 'Instructor leading the event' })
  @IsString()
  instructor: string;

  @ApiProperty({
    description: 'Type of the event',
    enum: EventType,
    enumName: 'EventType',
    example: EventTypeEnum.AUTONOMOUS,
  })
  @IsEnum(EventType, {
    message:
      'type must have one of these values: ' +
      Object.values(EventType).join(', '),
  })
  @IsString()
  type: EventType;

  @ApiPropertyOptional({ description: 'Scheduled times for the event' })
  @IsOptional()
  @IsString()
  times?: string;

  @ApiPropertyOptional({ description: 'Detailed description of the event' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Location where the event will take place',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Frequency of the event (e.g., weekly)' })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiPropertyOptional({
    description: 'Cost of the event',
    example: 50.0,
    type: 'number',
  })
  @IsOptional()
  @IsNumber()
  cost: number;

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);

    if (Decimal.isDecimal(this.cost)) {
      this.cost = this.cost.toNumber();
    }
  }
}
