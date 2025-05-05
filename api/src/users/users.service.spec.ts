import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UserManager } from "./user.manager";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApplicationUserDto } from "./dto/application-user.dto";
import { plainToInstance } from "class-transformer";
import { NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  applicationUserDtoMock,
  createUserDtoMock,
  applicationUsersList,
  mappedUserPlainToInstanceMock,
  updateUserDtoMock,
} from "test/mocks/users.mock";
import { ApplicationUser } from "@prisma/client";

describe("UsersService", () => {
  let service: UsersService;

  // Mock PrismaService
  const prismaMock = {
    client: {
      applicationUser: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
        paginate: jest.fn(),
      },
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
          provide: "ExtendedPrismaService",
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a new user successfully", async () => {
    const newUserInputData: CreateUserDto = createUserDtoMock();
    const mappedUserPlainToInstance = mappedUserPlainToInstanceMock();
    userManagerMock.createUser.mockResolvedValue(mappedUserPlainToInstance);

    const output = await service.create(newUserInputData);

    expect(userManagerMock.createUser).toHaveBeenCalledWith(
      {
        ...mappedUserPlainToInstance,
        passwordHash: "",
      },
      newUserInputData.password
    );

    expect(output).toEqual(mappedUserPlainToInstance);
  });

  it("should throw an HttpException if user creation fails", async () => {
    const newUserInputData: CreateUserDto = createUserDtoMock();

    const mappedUser = plainToInstance(ApplicationUserDto, newUserInputData, {
      excludeExtraneousValues: true,
    });

    const createUserInput = { ...mappedUser, passwordHash: "" };

    userManagerMock.createUser.mockRejectedValue(new NotFoundException());

    await expect(service.create(newUserInputData)).rejects.toThrow(
      NotFoundException
    );

    expect(userManagerMock.createUser).toHaveBeenCalledWith(
      createUserInput,
      newUserInputData.password
    );
  });

  // Successfull data return
  it("should return paginated users with metadata", async () => {
    const users: ApplicationUser[] = [
      {
        id: "id1",
        email: "user1@example.com",
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        birthDate: "",
        role: "USER",
        isEmailVerified: false,
        lastLogin: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        picturePath: "",
        twoFactorEnabled: false,
        emailConfirmationToken: "",
        emailConfirmationTokenExpiry: undefined,
        passwordHash: "",
        passwordResetToken: "",
        passwordResetTokenExpiry: undefined,
        twoFactorCode: "",
        twoFactorExpiry: undefined,
        failedLoginAttempts: 0,
      },
    ];

    const pagination = { page: 0, perPage: 5 };

    prismaMock.client.applicationUser.paginate.mockResolvedValue({
      data: users,
      meta: {
        currentPage: 0,
        items: 1,
        hasNextPage: false,
        totalItems: 1,
        totalPages: 1,
      },
    });

    const result = await service.findAll(pagination);

    expect(prismaMock.client.applicationUser.paginate).toHaveBeenCalledWith(
      pagination,
      { include: { physiotherapist: true, patient: true } },
      { mapType: expect.any(Function) }
    );

    expect(result.meta).toEqual({
      currentPage: 0,
      items: 1,
      hasNextPage: false,
      totalItems: 1,
      totalPages: 1,
    });
  });

  // Successful empty list data return
  it("should handle an empty list of users", async () => {
    const pagination = { page: 0, perPage: 2 };

    prismaMock.client.applicationUser.paginate.mockResolvedValue({
      data: [],
      meta: {
        currentPage: 0,
        items: 0,
        hasNextPage: false,
        totalItems: 0,
        totalPages: 0,
      },
    });

    const result = await service.findAll(pagination);

    expect(result).toEqual({
      data: [],
      meta: {
        currentPage: 0,
        items: 0,
        hasNextPage: false,
        totalItems: 0,
        totalPages: 0,
      },
    });
  });

  // Successful data return
  it("should return user data succesfully", async () => {
    const user: ApplicationUserDto = applicationUserDtoMock();

    const plainToInstanceUser = plainToInstance(ApplicationUserDto, user, {
      excludeExtraneousValues: true,
    });

    userManagerMock.getUserById.mockResolvedValue(plainToInstanceUser);

    const output = await service.findOne(user.id);

    expect(userManagerMock.getUserById).toHaveBeenCalledWith(user.id);

    expect(output).toEqual(plainToInstanceUser);
  });

  // User not found
  it("should throw an HttpException if user is not found", async () => {
    const user = applicationUsersList()[0];

    userManagerMock.getUserById.mockRejectedValue(new NotFoundException());

    await expect(service.findOne(user.id)).rejects.toThrow(NotFoundException);

    expect(userManagerMock.getUserById).toHaveBeenCalledWith(user.id);
  });

  // Successful data return
  it("should found and return user data succesfully by email", async () => {
    const user: ApplicationUserDto = applicationUserDtoMock();

    const plainToInstanceUser = plainToInstance(ApplicationUserDto, user, {
      excludeExtraneousValues: true,
    });

    userManagerMock.getUserByEmail.mockResolvedValue(plainToInstanceUser);

    const output = await service.findOneByEmail(user.email);

    expect(userManagerMock.getUserByEmail).toHaveBeenCalledWith(user.email);

    expect(output).toEqual(plainToInstanceUser);
  });

  // User not found
  it("should throw an HttpException if user is not found", async () => {
    const user = applicationUsersList()[0];

    userManagerMock.getUserByEmail.mockRejectedValue(new NotFoundException());

    await expect(service.findOneByEmail(user.email)).rejects.toThrow(
      NotFoundException
    );

    expect(userManagerMock.getUserByEmail).toHaveBeenCalledWith(user.email);
  });

  it("should update an existing user successfully", async () => {
    const user = applicationUsersList()[0];
    const dto: UpdateUserDto = updateUserDtoMock();

    userManagerMock.updateUser.mockResolvedValue(dto);

    const updatedUser = await service.update(user.id, dto);

    expect(userManagerMock.updateUser).toHaveBeenCalledWith(user.id, dto);
    expect(updatedUser).toEqual(plainToInstance(ApplicationUserDto, dto));
  });

  it("should remove a user successfully", async () => {
    const user = applicationUsersList()[0];

    const result = { success: true };

    userManagerMock.deleteUser.mockResolvedValue(result);

    await service.remove(user.id);

    expect(userManagerMock.deleteUser).toHaveBeenCalledWith(user.id);
  });

  it("should throw an error if user removal fails", async () => {
    const user = applicationUsersList()[0];

    userManagerMock.deleteUser.mockRejectedValue(
      new Error("User removal failed")
    );

    await expect(service.remove(user.id)).rejects.toThrow(Error);
  });
});
