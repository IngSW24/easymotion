import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApplicationUserDto } from './dto/application-user.dto';
import { UserManager } from './user.manager';
import {
  isSuccessResult,
  resultToHttpException,
} from 'src/common/types/result';
import { CrudService } from 'src/common/abstractions/crud-service.interface';
import { PaginationFilter } from 'src/common/dto/pagination-filter.dto';
import { PaginatedOutput } from 'src/common/dto/paginated-output.dto';
import { plainToInstance } from 'class-transformer';

/**
 * The UsersService class provides high-level CRUD operations for ApplicationUsers,
 * delegating lower-level operations to the UserManager. It implements the CrudService
 * interface using CreateUserDto, UpdateUserDto, and ApplicationUserDto.
 */
@Injectable()
export class UsersService
  implements CrudService<CreateUserDto, UpdateUserDto, ApplicationUserDto>
{
  /**
   * @param prisma      - The PrismaService instance used for database interactions.
   * @param userManager - The UserManager which handles user-related database logic.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly userManager: UserManager,
  ) {}

  /**
   * Creates a new user.
   * @param newUser - The DTO containing new user data (email, username, etc.) and password.
   * @returns A promise that resolves to an ApplicationUserDto representing the created user.
   * @throws HttpException (mapped from Result) if user creation fails, e.g., if the user already exists.
   */
  async create(newUser: CreateUserDto): Promise<ApplicationUserDto> {
    const mappedUser = plainToInstance(ApplicationUserDto, newUser, {
      excludeExtraneousValues: true,
    });

    const result = await this.userManager.createUser(
      { ...mappedUser, passwordHash: '' },
      newUser.password,
    );

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    return new ApplicationUserDto(result.data);
  }

  /**
   * Retrieves a paginated list of users.
   * @param pagination - An object containing the current page and items per page.
   * @returns A promise that resolves to a PaginatedOutput of ApplicationUserDto,
   *          including pagination metadata (e.g., total count, hasNextPage, etc.).
   */
  async findAll(
    pagination: PaginationFilter,
  ): Promise<PaginatedOutput<ApplicationUserDto>> {
    const { page, perPage } = pagination;

    const count = await this.prisma.applicationUser.count();
    const users = await this.prisma.applicationUser.findMany({
      skip: page * perPage,
      take: perPage,
    });

    return {
      data: users.map((u) => new ApplicationUserDto(u)),
      meta: {
        currentPage: page,
        items: users.length,
        hasNextPage: (page + 1) * perPage < count,
        totalItems: count,
        totalPages: Math.ceil(count / perPage),
      },
    };
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The user ID to look up.
   * @returns A promise that resolves to an ApplicationUserDto if the user is found.
   * @throws HttpException (mapped from Result) if the user does not exist.
   */
  async findOne(id: string): Promise<ApplicationUserDto> {
    const result = await this.userManager.getUserById(id);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    return new ApplicationUserDto(result.data);
  }

  /**
   * Finds a user by their email address.
   * @param email - The email to look up.
   * @returns A promise that resolves to an ApplicationUserDto if the user is found.
   * @throws HttpException (mapped from Result) if the user does not exist.
   */
  async findOneByEmail(email: string): Promise<ApplicationUserDto> {
    const result = await this.userManager.getUserByEmail(email);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    return new ApplicationUserDto(result.data);
  }

  /**
   * Updates a user with the provided data.
   * @param id - The ID of the user to update.
   * @param data - The DTO containing fields to update (e.g., firstName, lastName, etc.).
   * @returns A promise that resolves to an ApplicationUserDto representing the updated user.
   * @throws HttpException (mapped from Result) if the user is not found or update fails.
   */
  async update(id: string, data: UpdateUserDto): Promise<ApplicationUserDto> {
    const result = await this.userManager.updateUser(id, data);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }

    return new ApplicationUserDto(result.data);
  }

  /**
   * Removes (deletes) a user by their unique ID.
   * @param id - The ID of the user to remove.
   * @returns A promise that resolves to void if successful.
   * @throws HttpException (mapped from Result) if the user does not exist or removal fails.
   */
  async remove(id: string): Promise<void> {
    const result = await this.userManager.deleteUser(id);

    if (!isSuccessResult(result)) {
      throw resultToHttpException(result);
    }
  }
}
