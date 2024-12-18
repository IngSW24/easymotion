import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCoursesDto } from './dto/update-course.dto';
import { CourseEntity } from './entities/course.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { PaginationFilter } from 'src/common/dto/pagination-filter.dto';

describe('CoursesController', () => {
  let controller: CoursesController;
  let prismaMock: any;

  beforeEach(async () => {
    // Mock PrismaService
    prismaMock = {
      course: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        CoursesService, // Use the real service
        {
          provide: PrismaService,
          useValue: prismaMock, // Mock PrismaService
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  // Test Create
  it('should create a new course', async () => {
    const dto: CreateCourseDto = {
      name: 'aa',
      description: '',
      short_description: '',
      schedule: [],
      instructor: [],
      category: 'ACQUAGYM',
      level: 'BASIC',
      frequency: 'SINGLE_SESSION',
      session_duration: '',
      availability: 'ACTIVE',
      num_registered_members: 0,
      tags: [],
    };

    const createdCourse = {
      id: '1',
      ...dto,
      cost: new Decimal(100),
    };

    prismaMock.course.create.mockResolvedValue(createdCourse);

    const result = await controller.create(dto);

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

  // Test FindAll
  it('should return paginated courses', async () => {
    const pagination: PaginationFilter = { page: 0, perPage: 10 };

    const mockCourses: CourseEntity[] = [
      {
        id: '',
        name: '',
        description: '',
        short_description: '',
        schedule: [],
        instructor: [],
        category: 'ACQUAGYM',
        level: 'BASIC',
        frequency: 'SINGLE_SESSION',
        session_duration: '',
        availability: 'ACTIVE',
        num_registered_members: 0,
        tags: [],
      },
    ];
    const totalItems = 1;

    prismaMock.course.findMany.mockResolvedValue(mockCourses);
    prismaMock.course.count.mockResolvedValue(totalItems);

    const result = await controller.findAll(pagination);

    expect(prismaMock.course.findMany).toHaveBeenCalledWith({
      skip: pagination.page * pagination.perPage,
      take: pagination.perPage,
    });
    expect(prismaMock.course.count).toHaveBeenCalled();

    expect(result).toEqual({
      data: [
        new CourseEntity({
          id: '',
          name: '',
          description: '',
          short_description: '',
          schedule: [],
          instructor: [],
          category: 'ACQUAGYM',
          level: 'BASIC',
          frequency: 'SINGLE_SESSION',
          session_duration: '',
          availability: 'ACTIVE',
          num_registered_members: 0,
          tags: [],
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
  it('should return a single course', async () => {
    const id = '1';
    const mockCourse: CourseEntity = {
      id,
      description: 'aaaaa',
      short_description: '',
      schedule: [],
      instructor: [],
      category: 'ACQUAGYM',
      level: 'BASIC',
      frequency: 'SINGLE_SESSION',
      session_duration: '',
      availability: 'ACTIVE',
      num_registered_members: 0,
      tags: [],
      name: 'aaaaaaaaaa',
    };

    prismaMock.course.findUniqueOrThrow.mockResolvedValue(mockCourse);

    const result = await controller.findOne(id);

    expect(prismaMock.course.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(
      new CourseEntity({
        ...mockCourse,
      }),
    );
  });

  // Test Update
  it('should update an course', async () => {
    const id = '1';
    const dto: UpdateCoursesDto = {
      instructor: ['Updated Organizer'],
      cost: 250,
    };

    const updatedCourse = {
      id,
      ...dto,
      cost: new Decimal(250),
    };

    prismaMock.course.update.mockResolvedValue(updatedCourse);

    const result = await controller.update(id, dto);

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

  // Test Remove
  it('should remove an course', async () => {
    const id = '1';

    prismaMock.course.delete.mockResolvedValue(undefined);

    const result = await controller.remove(id);

    expect(prismaMock.course.delete).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toBeUndefined();
  });
});
