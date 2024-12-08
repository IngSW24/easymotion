import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { Event } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PaginatedOutput } from 'src/common/dto/paginated-output.dto';
import { PaginationFilter } from 'src/common/dto/pagination-filter.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateEventDto) {
    const event = await this.prismaService.event.create({
      data: { ...(data as any) },
    });

    return this.mapToDto(event);
  }

  async findAll(
    pagination: PaginationFilter,
  ): Promise<PaginatedOutput<EventEntity>> {
    const { page, perPage } = pagination;

    const count = await this.prismaService.event.count();

    const events = await this.prismaService.event.findMany({
      skip: page * perPage,
      take: perPage,
    });

    return {
      data: this.mapToDto(events), // Array of mapped events
      meta: {
        currentPage: page,
        items: events.length,
        hasNextPage: (page + 1) * perPage < count,
        totalItems: count,
        totalPages: Math.ceil(count / perPage),
      },
    };
  }

  async findOne(id: string) {
    const event = await this.prismaService.event.findUniqueOrThrow({
      where: { id },
    });

    return this.mapToDto(event);
  }

  async update(id: string, data: UpdateEventDto) {
    const updatedEvent = await this.prismaService.event.update({
      where: { id },
      data: { ...(data as any) },
    });

    return this.mapToDto(updatedEvent);
  }

  async remove(id: string) {
    await this.prismaService.event.delete({
      where: { id },
    });
  }

  private mapToDto<T extends Event | Event[]>(event: T): MapOutput<T> {
    if (Array.isArray(event)) {
      return event.map(
        (x) => new EventEntity({ ...x, cost: x.cost.toNumber() }),
      ) as MapOutput<T>;
    }

    return new EventEntity({
      ...event,
      cost: event.cost.toNumber(),
    }) as MapOutput<T>;
  }
}

type MapOutput<T> = T extends Event[] ? EventEntity[] : EventEntity;
