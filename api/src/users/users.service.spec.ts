import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'nestjs-prisma';
import { UserManager } from './user.manager';
import { CreateUserDto } from './dto/create-user.dto';
import { ApplicationUserDto } from './dto/application-user.dto';
import { plainToInstance } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  // Mock PrismaService
  const prismaMock = {
    applicationUser: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
  };

  // Mock UserManager
  const userManagerMock = {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    prisma: prismaMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserManager,
          useValue: userManagerMock,
        },
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

  // #region Create method test

  it('should create a new user successfully', async () => {
    const newUser: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'securepassword123',
      firstName: 'testname',
      lastName: 'lastname',
      middleName: 'middlename',
      birthDate: '01-01-1999',
      phoneNumber: '0000000000',
      role: 'ADMIN',
    };

    const mappedUser = plainToInstance(ApplicationUserDto, newUser, {
      excludeExtraneousValues: true,
    });

    const createUserInput = { ...mappedUser, passwordHash: '' };

    // Mock for checking user existence
    userManagerMock.prisma.applicationUser.findFirst.mockResolvedValue(null);

    const createdUser: ApplicationUserDto = {
      id: 'e5b754a9-9ea3-43e0-8acf-aa664b06d995',
      ...mappedUser,
    };

    const result = { success: true, data: createdUser };
    userManagerMock.createUser.mockResolvedValue(result);

    const output = await service.create(newUser);

    expect(userManagerMock.createUser).toHaveBeenCalledWith(
      createUserInput,
      newUser.password,
    );

    expect(output).toEqual(mappedUser);
  });

  it('should throw an HttpException if user creation fails', async () => {
    const newUser: CreateUserDto = {
      email: 'test@example.com',

      firstName: 'testname',
      lastName: 'lastname',
      middleName: 'middlename',
      birthDate: '01-01-1999',
      phoneNumber: '0000000000',
      role: 'ADMIN',
      password: 'password',
      username: 'testuser',
    };

    const mappedUser = plainToInstance(ApplicationUserDto, newUser, {
      excludeExtraneousValues: true,
    });

    const createUserInput = { ...mappedUser, passwordHash: '' };

    const errorResult = {
      success: false,
      errors: ['User with this email or username already exists'],
      code: HttpStatus.CONFLICT,
    };

    userManagerMock.createUser.mockResolvedValue(errorResult);

    await expect(service.create(newUser)).rejects.toThrow(HttpException);

    expect(userManagerMock.createUser).toHaveBeenCalledWith(
      createUserInput,
      newUser.password,
    );
  });

  // #endregion

  // #region FindAll method test

  // Successfull data return
  it('should return paginated users with metadata', async () => {
    const users = [
      {
        id: '27b10d39-b26f-4786-874b-ee53556e6bdd',
        email: 'user1@example.com',
        username: 'user1',
      },
      {
        id: '58dbaf7f-ab07-4e77-a77d-c47851ba1be7',
        email: 'user2@example.com',
        username: 'user2',
      },
    ];

    const pagination = { page: 0, perPage: 5 };

    prismaMock.applicationUser.count.mockResolvedValue(5);
    prismaMock.applicationUser.findMany.mockResolvedValue(users);

    const result = await service.findAll(pagination);

    expect(prismaMock.applicationUser.count).toHaveBeenCalled();
    expect(prismaMock.applicationUser.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 5,
    });

    expect(result).toEqual({
      data: [
        new ApplicationUserDto(users[0]),
        new ApplicationUserDto(users[1]),
      ],
      meta: {
        currentPage: 0,
        items: 2,
        hasNextPage: false,
        totalItems: 5,
        totalPages: 1,
      },
    });
  });

  // Successful empty list data return
  it('should handle an empty list of users', async () => {
    const pagination = { page: 1, perPage: 2 };

    // Mock Prisma results
    prismaMock.applicationUser.count.mockResolvedValue(0);
    prismaMock.applicationUser.findMany.mockResolvedValue([]);

    const result = await service.findAll(pagination);

    expect(prismaMock.applicationUser.count).toHaveBeenCalled();
    expect(prismaMock.applicationUser.findMany).toHaveBeenCalledWith({
      skip: 2,
      take: 2,
    });

    expect(result).toEqual({
      data: [],
      meta: {
        currentPage: 1,
        items: 0,
        hasNextPage: false,
        totalItems: 0,
        totalPages: 0,
      },
    });
  });

  // #endregion

  // #region FindOne method test

  // Successful data return
  it('should return user data succesfully', async () => {
    const user: ApplicationUserDto = {
      id: 'e3bbff8c-9c49-439f-9c70-9ff5b0adf29a',
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: 'securepassword123',
      firstName: 'testname',
      lastName: 'lastname',
      middleName: 'middlename',
      birthDate: '01-01-1999',
      phoneNumber: '0000000000',
      role: 'ADMIN',
      isEmailVerified: false,
      lastLogin: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      emailConfirmationToken: '',
      emailConfirmationTokenExpiry: undefined,
      passwordResetToken: '',
      passwordResetTokenExpiry: undefined,
      twoFactorCode: '',
      twoFactorExpiry: undefined,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
    };

    const result = { success: true, data: user };

    userManagerMock.getUserById.mockResolvedValue(result);

    const output = await service.findOne(user.id);

    expect(userManagerMock.getUserById).toHaveBeenCalledWith(user.id);

    expect(output).toEqual(user);
  });

  // User not found
  it('should throw an HttpException if user is not found', async () => {
    const user = {
      id: 'e74eb1e1-65cd-48ff-b976-1d1d5f9761cb',
    };

    const result = {
      success: false,
      errors: ['User not found'],
      code: HttpStatus.NOT_FOUND,
    };

    userManagerMock.getUserById.mockResolvedValue(result);

    await expect(service.findOne(user.id)).rejects.toThrow(HttpException);

    expect(userManagerMock.getUserById).toHaveBeenCalledWith(user.id);
  });
  // #endregion

  // #region FindOneByEmail method test

  // Successful data return
  it('should found and return user data succesfully by email', async () => {
    const user: ApplicationUserDto = {
      id: 'e3bbff8c-9c49-439f-9c70-9ff5b0adf29a',
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: 'securepassword123',
      firstName: 'testname',
      lastName: 'lastname',
      middleName: 'middlename',
      birthDate: '01-01-1999',
      phoneNumber: '0000000000',
      role: 'ADMIN',
      isEmailVerified: false,
      lastLogin: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      emailConfirmationToken: '',
      emailConfirmationTokenExpiry: undefined,
      passwordResetToken: '',
      passwordResetTokenExpiry: undefined,
      twoFactorCode: '',
      twoFactorExpiry: undefined,
      twoFactorEnabled: false,
      failedLoginAttempts: 0,
    };

    const result = { success: true, data: user };

    userManagerMock.getUserByEmail.mockResolvedValue(result);

    const output = await service.findOneByEmail(user.email);

    expect(userManagerMock.getUserByEmail).toHaveBeenCalledWith(user.email);

    expect(output).toEqual(user);
  });

  // User not found
  it('should throw an HttpException if user is not found', async () => {
    const user = {
      email: 'test@example.com',
    };

    const result = {
      success: false,
      errors: ['User not found'],
      code: HttpStatus.NOT_FOUND,
    };

    userManagerMock.getUserByEmail.mockResolvedValue(result);

    await expect(service.findOneByEmail(user.email)).rejects.toThrow(
      HttpException,
    );

    expect(userManagerMock.getUserByEmail).toHaveBeenCalledWith(user.email);
  });
  // #endregion

  // #region Update method test

  it('should update an existing user successfully', async () => {
    const id = '6fcc3b17-3f79-4ca9-9ab2-ef8e02eadbed';
    const dto: UpdateUserDto = {
      email: 'newemail@example.com',
      username: 'newusername',
      firstName: 'newname',
      lastName: 'newlastname',
    };

    const result = {
      success: true,
      data: dto,
    };

    userManagerMock.updateUser.mockResolvedValue(result);

    const updatedUser = await service.update(id, dto);

    expect(userManagerMock.updateUser).toHaveBeenCalledWith(id, dto);
    expect(updatedUser).toEqual(new ApplicationUserDto(result.data));
  });

  it('should throw an error if user does not exist', async () => {
    const id = 'f00b6a5f-4f5c-4508-be01-9598b3e5be98';
    const dto: UpdateUserDto = {
      email: 'newemail@example.com',
      username: 'newusername',
      firstName: 'newname',
      lastName: 'newlastname',
    };

    const result = {
      success: false,
      errors: ['User not found'],
      code: HttpStatus.NOT_FOUND,
    };

    userManagerMock.updateUser.mockResolvedValue(result);

    await expect(service.update(id, dto)).rejects.toThrow(HttpException);

    expect(userManagerMock.updateUser).toHaveBeenCalledWith(id, dto);
  });

  // #endregion

  // #region Remove method test

  it('should remove a user successfully', async () => {
    const id = '76c354b2-d4cc-482d-828d-88dc1aa47eda';

    const result = { success: true };

    userManagerMock.deleteUser.mockResolvedValue(result);

    await service.remove(id);

    expect(userManagerMock.deleteUser).toHaveBeenCalledWith(id);
  });

  it('should throw an error if user removal fails', async () => {
    const id = '78d95fd5-aeee-41ff-8634-eb1a62cf43a9';

    const result = {
      success: false,
      errors: ['User not found'],
      code: HttpStatus.NOT_FOUND,
    };

    userManagerMock.deleteUser.mockResolvedValue(result);

    await expect(service.remove(id)).rejects.toThrow(HttpException);
  });
  // #endregion
});
