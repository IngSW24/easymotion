import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'nestjs-prisma';
import { UserManager } from './user.manager';
import { CreateUserDto } from './dto/create-user.dto';
import { ApplicationUserDto } from './dto/application-user.dto';
import { Prisma } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;

  // Mock PrismaService
  const prismaMock = {
    applicationUser: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  // Mock UserManager
  const userManagerMock = {
    createUser: jest.fn(),
    prisma: prismaMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserManager,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
