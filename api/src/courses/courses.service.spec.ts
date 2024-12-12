import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from 'nestjs-prisma';
import { CourseEntity } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCoursesDto } from './dto/update-course.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { CourseType } from '@prisma/client';

describe('CoursesService', () => {
  let service: CoursesService;
  let prismaService: PrismaService;

  // Mock PrismaService
  const prismaMock = {
    course: {
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
        CoursesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Create Method Test
  it('should create an course', async () => {
    const dto: CreateCourseDto = {
      organizer: 'John Doe',
      instructor: 'Jane Doe',
      type: CourseType.INDIVIDUAL,
      cost: 100,
    };
    const createdCourse = {
      id: '1',
      ...dto,
      cost: new Decimal(100),
    };

    prismaMock.course.create.mockResolvedValue(createdCourse);

    const result = await service.create(dto);

    expect(prismaMock.course.create).toHaveBeenCalledWith({
      data: { ...dto },
    });
    expect(result).toEqual(
      new CourseEntity({
        ...createdCourse,
        cost: createdCourse.cost.toNumber(),
      }),
    );
  });

  // FindAll Method Test
  it('should return paginated courses', async () => {
    const pagination = { page: 0, perPage: 2 };
    const mockCourses = [
      {
        id: '1',
        organizer: 'John Doe',
        instructor: 'Jane Doe',
        type: CourseType.GROUP,
        cost: new Decimal(200),
      },
      {
        id: '2',
        organizer: 'Alice',
        instructor: 'Bob',
        type: CourseType.INDIVIDUAL,
        cost: new Decimal(300),
      },
    ];
    const totalItems = 5;

    prismaMock.course.findMany.mockResolvedValue(mockCourses);
    prismaMock.course.count.mockResolvedValue(totalItems);

    const result = await service.findAll(pagination);

    expect(prismaMock.course.findMany).toHaveBeenCalledWith({
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });
    expect(prismaMock.course.count).toHaveBeenCalled();

    expect(result).toEqual({
      data: mockCourses.map(
        (course) => new CourseEntity({ ...course, cost: course.cost.toNumber() }),
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
  it('should return a single course', async () => {
    const id = '1';
    const mockCourse = {
      id,
      organizer: 'John Doe',
      instructor: 'Jane Doe',
      type: CourseType.INDIVIDUAL,
      cost: new Decimal(150),
    };

    prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

    const result = await service.findOne(id);

    expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(
      new CourseEntity({
        ...mockCourse,
        cost: mockCourse.cost.toNumber(),
      }),
    );
  });

  // Update Method Test
  it('should update an course', async () => {
    const id = '1';
    const dto: UpdateCoursesDto = { organizer: 'Updated Organizer', cost: 250 };
    const updatedCourse = {
      id,
      ...dto,
      cost: new Decimal(250),
    };

    prismaMock.course.update.mockResolvedValue(updatedCourse);

    const result = await service.update(id, dto);

    expect(prismaMock.course.update).toHaveBeenCalledWith({
      where: { id },
      data: { ...dto },
    });
    expect(result).toEqual(
      new CourseEntity({
        ...updatedCourse,
        cost: updatedCourse.cost.toNumber(),
      }),
    );
  });

  // Remove Method Test
  it('should remove an course', async () => {
    const id = '1';

    prismaMock.course.delete.mockResolvedValue(undefined);

    await service.remove(id);

    expect(prismaMock.course.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
