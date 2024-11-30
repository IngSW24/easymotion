import { Exclude, Expose } from 'class-transformer';
import {
  IS_ENUM,
  isEnum,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Event, EventType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export enum EventTypeEnum {
  AUTONOMOUS = 'autonomous',
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export class EventEntity {
  @IsString()
  id: string;

  @IsString()
  organizer: string;

  @IsString()
  instructor: string;

  @IsEnum(EventType, {
    message:
      'type must have one of these values: ' +
      Object.values(EventType).join(', '),
  })
  @IsString()
  type: EventType;

  @IsOptional()
  @IsString()
  times?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

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
