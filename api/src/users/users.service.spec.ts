import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'nestjs-prisma';
import { UserManager } from './user.manager';
import { CreateUserDto } from './dto/create-user.dto';
import { ApplicationUserDto } from './dto/application-user.dto';
import { plainToInstance } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  applicationUserDtoMock,
  createUserDtoMock,
  applicationUsersList,
  mappedUserPlainToInstanceMock,
  updateUserDtoMock,
} from 'test/mocks/users.mock';

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
    const newUserInputData: CreateUserDto = createUserDtoMock();
    const mappedUserPlainToInstance = mappedUserPlainToInstanceMock();

    const result = { success: true, data: mappedUserPlainToInstance };
    userManagerMock.createUser.mockResolvedValue(result);

    const output = await service.create(newUserInputData);

    expect(userManagerMock.createUser).toHaveBeenCalledWith(
      {
        ...mappedUserPlainToInstance,
        passwordHash: '',
      },
      newUserInputData.password,
    );

    expect(output).toEqual(mappedUserPlainToInstance);
  });

  it('should throw an HttpException if user creation fails', async () => {
    const newUserInputData: CreateUserDto = createUserDtoMock();

    const mappedUser = plainToInstance(ApplicationUserDto, newUserInputData, {
      excludeExtraneousValues: true,
    });

    const createUserInput = { ...mappedUser, passwordHash: '' };

    const errorResult = {
      success: false,
      errors: ['User with this email or username already exists'],
      code: HttpStatus.CONFLICT,
    };

    userManagerMock.createUser.mockResolvedValue(errorResult);

    await expect(service.create(newUserInputData)).rejects.toThrow(
      HttpException,
    );

    expect(userManagerMock.createUser).toHaveBeenCalledWith(
      createUserInput,
      newUserInputData.password,
    );
  });

  // #endregion

  // #region FindAll method test

  // Successfull data return
  it('should return paginated users with metadata', async () => {
    const users = applicationUsersList();

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
    const user: ApplicationUserDto = applicationUserDtoMock();

    const result = { success: true, data: user };

    userManagerMock.getUserById.mockResolvedValue(result);

    const output = await service.findOne(user.id);

    expect(userManagerMock.getUserById).toHaveBeenCalledWith(user.id);

    expect(output).toEqual(user);
  });

  // User not found
  it('should throw an HttpException if user is not found', async () => {
    const user = applicationUsersList()[0];

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
    const user: ApplicationUserDto = applicationUserDtoMock();

    const result = { success: true, data: user };

    userManagerMock.getUserByEmail.mockResolvedValue(result);

    const output = await service.findOneByEmail(user.email);

    expect(userManagerMock.getUserByEmail).toHaveBeenCalledWith(user.email);

    expect(output).toEqual(user);
  });

  // User not found
  it('should throw an HttpException if user is not found', async () => {
    const user = applicationUsersList()[0];

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
    const user = applicationUsersList()[0];
    const dto: UpdateUserDto = updateUserDtoMock();

    const result = {
      success: true,
      data: dto,
    };

    userManagerMock.updateUser.mockResolvedValue(result);

    const updatedUser = await service.update(user.id, dto);

    expect(userManagerMock.updateUser).toHaveBeenCalledWith(user.id, dto);
    expect(updatedUser).toEqual(new ApplicationUserDto(result.data));
  });

  it('should throw an error if user does not exist', async () => {
    const user = applicationUsersList()[0];
    const dto: UpdateUserDto = updateUserDtoMock();

    const result = {
      success: false,
      errors: ['User not found'],
      code: HttpStatus.NOT_FOUND,
    };

    userManagerMock.updateUser.mockResolvedValue(result);

    await expect(service.update(user.id, dto)).rejects.toThrow(HttpException);

    expect(userManagerMock.updateUser).toHaveBeenCalledWith(user.id, dto);
  });

  // #endregion

  // #region Remove method test

  it('should remove a user successfully', async () => {
    const user = applicationUsersList()[0];

    const result = { success: true };

    userManagerMock.deleteUser.mockResolvedValue(result);

    await service.remove(user.id);

    expect(userManagerMock.deleteUser).toHaveBeenCalledWith(user.id);
  });

  it('should throw an error if user removal fails', async () => {
    const user = applicationUsersList()[0];

    const result = {
      success: false,
      errors: ['User not found'],
      code: HttpStatus.NOT_FOUND,
    };

    userManagerMock.deleteUser.mockResolvedValue(result);

    await expect(service.remove(user.id)).rejects.toThrow(HttpException);
  });
  // #endregion
});
