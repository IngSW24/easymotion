import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { EventEntity } from '../entities/event.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { EventType } from '@prisma/client';

export class UpdateEventDto extends PartialType(
  OmitType(EventEntity, ['id']),
) {}
