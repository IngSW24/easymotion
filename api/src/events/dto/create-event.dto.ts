import { OmitType } from '@nestjs/swagger';
import { EventEntity } from '../entities/event.entity';

export class CreateEventDto extends OmitType(EventEntity, ['id']) {}
