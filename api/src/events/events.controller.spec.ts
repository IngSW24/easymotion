import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { PaginationFilter } from 'src/common/dto/pagination-filter.dto';
import { EventType } from '@prisma/client';

describe('EventsController', () => {
  let controller: EventsController;
  let prismaMock: any;

  beforeEach(async () => {
    // Mock PrismaService
    prismaMock = {
      event: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsService, // Use the real service
        {
          provide: PrismaService,
          useValue: prismaMock, // Mock PrismaService
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  // Test Create
  it('should create a new event', async () => {
    const dto: CreateEventDto = {
      organizer: 'John Doe',
      instructor: 'Jane Doe',
      type: EventType.INDIVIDUAL,
      cost: 100,
    };

    const createdEvent = {
      id: '1',
      ...dto,
      cost: new Decimal(100),
    };

    prismaMock.event.create.mockResolvedValue(createdEvent);

    const result = await controller.create(dto);

    expect(prismaMock.event.create).toHaveBeenCalledWith({
      data: { ...dto },
    });
    expect(result).toEqual(
      new EventEntity({
        ...createdEvent,
        cost: createdEvent.cost.toNumber(),
      }),
    );
  });

  // Test FindAll
  it('should return paginated events', async () => {
    const pagination: PaginationFilter = { page: 0, perPage: 10 };

    const mockEvents = [
      {
        id: '1',
        organizer: 'John Doe',
        instructor: 'Jane Doe',
        type: EventType.GROUP,
        cost: new Decimal(200),
      },
    ];
    const totalItems = 1;

    prismaMock.event.findMany.mockResolvedValue(mockEvents);
    prismaMock.event.count.mockResolvedValue(totalItems);

    const result = await controller.findAll(pagination);

    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });
    expect(prismaMock.event.count).toHaveBeenCalled();

    expect(result).toEqual({
      data: [
        new EventEntity({
          id: '1',
          organizer: 'John Doe',
          instructor: 'Jane Doe',
          type: EventType.GROUP,
          cost: 200,
        }),
      ],
      meta: {
        currentPage: pagination.page,
        items: 1,
        hasNextPage: false,
        totalItems: totalItems,
        totalPages: 1,
      },
    });
  });

  // Test FindOne
  it('should return a single event', async () => {
    const id = '1';
    const mockEvent = {
      id,
      organizer: 'John Doe',
      instructor: 'Jane Doe',
      type: EventType.INDIVIDUAL,
      cost: new Decimal(150),
    };

    prismaMock.event.findUniqueOrThrow.mockResolvedValue(mockEvent);

    const result = await controller.findOne(id);

    expect(prismaMock.event.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(
      new EventEntity({
        ...mockEvent,
        cost: mockEvent.cost.toNumber(),
      }),
    );
  });

  // Test Update
  it('should update an event', async () => {
    const id = '1';
    const dto: UpdateEventDto = {
      organizer: 'Updated Organizer',
      cost: 250,
    };

    const updatedEvent = {
      id,
      ...dto,
      cost: new Decimal(250),
    };

    prismaMock.event.update.mockResolvedValue(updatedEvent);

    const result = await controller.update(id, dto);

    expect(prismaMock.event.update).toHaveBeenCalledWith({
      where: { id },
      data: { ...dto },
    });
    expect(result).toEqual(
      new EventEntity({
        ...updatedEvent,
        cost: updatedEvent.cost.toNumber(),
      }),
    );
  });

  // Test Remove
  it('should remove an event', async () => {
    const id = '1';

    prismaMock.event.delete.mockResolvedValue(undefined);

    const result = await controller.remove(id);

    expect(prismaMock.event.delete).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toBeUndefined();
  });
});
