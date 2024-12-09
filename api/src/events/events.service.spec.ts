import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from 'nestjs-prisma';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { EventType } from '@prisma/client';

describe('EventsService', () => {
  let service: EventsService;
  let prismaService: PrismaService;

  // Mock PrismaService
  const prismaMock = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Create Method Test
  it('should create an event', async () => {
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

    const result = await service.create(dto);

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

  // FindAll Method Test
  it('should return paginated events', async () => {
    const pagination = { page: 0, perPage: 2 };
    const mockEvents = [
      {
        id: '1',
        organizer: 'John Doe',
        instructor: 'Jane Doe',
        type: EventType.GROUP,
        cost: new Decimal(200),
      },
      {
        id: '2',
        organizer: 'Alice',
        instructor: 'Bob',
        type: EventType.INDIVIDUAL,
        cost: new Decimal(300),
      },
    ];
    const totalItems = 5;

    prismaMock.event.findMany.mockResolvedValue(mockEvents);
    prismaMock.event.count.mockResolvedValue(totalItems);

    const result = await service.findAll(pagination);

    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });
    expect(prismaMock.event.count).toHaveBeenCalled();

    expect(result).toEqual({
      data: mockEvents.map(
        (event) => new EventEntity({ ...event, cost: event.cost.toNumber() }),
      ),
      meta: {
        currentPage: pagination.page,
        items: 2,
        hasNextPage: true,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / pagination.perPage),
      },
    });
  });

  // FindOne Method Test
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

    const result = await service.findOne(id);

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

  // Update Method Test
  it('should update an event', async () => {
    const id = '1';
    const dto: UpdateEventDto = { organizer: 'Updated Organizer', cost: 250 };
    const updatedEvent = {
      id,
      ...dto,
      cost: new Decimal(250),
    };

    prismaMock.event.update.mockResolvedValue(updatedEvent);

    const result = await service.update(id, dto);

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

  // Remove Method Test
  it('should remove an event', async () => {
    const id = '1';

    prismaMock.event.delete.mockResolvedValue(undefined);

    await service.remove(id);

    expect(prismaMock.event.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
