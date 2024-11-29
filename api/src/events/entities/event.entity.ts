import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class Event {
  @Expose()
  description: string;

  @Expose()
  location: string;

  @Expose()
  @IsNumber()
  cost: number;

  constructor(partial: Partial<Event>) {
    Object.assign(this, partial);
  }
}
