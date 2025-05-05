import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApplicationUserDto } from "./dto/application-user.dto";
import { UserManager } from "./user.manager";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { PaginatedOutput } from "src/common/dto/paginated-output.dto";
import { plainToInstance } from "class-transformer";
import { PhysiotherapistFilter } from "./filters/physiotherapist-filter.dto";
import { ApplicationUser, Physiotherapist, Prisma } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaService } from "src/common/prisma/pagination";
import ApplicationUserCreateDto from "./dto/create-application-user.dto";
import { PhysiotherapistProfileDto } from "./dto/physiotherapist-profile.dto";

/**
 * The UsersService class provides high-level CRUD operations for ApplicationUsers,
 * delegating lower-level operations to the UserManager. It implements the CrudService
 * interface using CreateUserDto, UpdateUserDto, and ApplicationUserDto.
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject("ExtendedPrismaService")
    private readonly prisma: CustomPrismaService<ExtendedPrismaService>,
    private readonly userManager: UserManager
  ) {}

  /**
   * Creates a new user.
   * @param newUser - The DTO containing new user data (email, etc.) and password.
   * @returns A promise that resolves to an ApplicationUserDto representing the created user.
   */
  async create(newUser: CreateUserDto): Promise<ApplicationUserDto> {
    const mappedUser = plainToInstance(ApplicationUserCreateDto, newUser, {
      excludeExtraneousValues: true,
    });

    const result = await this.userManager.createUser(
      { ...mappedUser, passwordHash: "" },
      newUser.password
    );

    return plainToInstance(ApplicationUserDto, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Retrieves a paginated list of users.
   * @param pagination - An object containing the current page and items per page.
   * @returns A promise that resolves to a PaginatedOutput of ApplicationUserDto,
   *          including pagination metadata (e.g., total count, hasNextPage, etc.).
   */
  async findAll(
    pagination: PaginationFilter
  ): Promise<PaginatedOutput<ApplicationUserDto>> {
    return this.prisma.client.applicationUser.paginate(
      pagination,
      {
        include: { physiotherapist: true, patient: true },
      },
      {
        mapType: ApplicationUserDto,
      }
    );
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The user ID to look up.
   * @returns A promise that resolves to an ApplicationUserDto if the user is found.
   */
  async findOne(id: string): Promise<ApplicationUserDto> {
    const result = await this.userManager.getUserById(id);

    return plainToInstance(ApplicationUserDto, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Finds a user by their email address.
   * @param email - The email to look up.
   * @returns A promise that resolves to an ApplicationUserDto if the user is found.
   */
  async findOneByEmail(email: string): Promise<ApplicationUserDto> {
    const result = await this.userManager.getUserByEmail(email);
    return plainToInstance(ApplicationUserDto, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Updates a user with the provided data.
   * @param id - The ID of the user to update.
   * @param data - The DTO containing fields to update (e.g., firstName, lastName, etc.).
   * @returns A promise that resolves to an ApplicationUserDto representing the updated user.
   */
  async update(id: string, data: UpdateUserDto): Promise<ApplicationUserDto> {
    const result = await this.userManager.updateUser(id, data);

    return plainToInstance(ApplicationUserDto, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Removes (deletes) a user by their unique ID.
   * @param id - The ID of the user to remove.
   * @returns A promise that resolves to void if successful.
   */
  async remove(id: string) {
    return this.userManager.deleteUser(id);
  }

  private mapPhysiotherapistToProfile(
    physiotherapist: Physiotherapist & { applicationUser: ApplicationUser }
  ) {
    const flags = {
      excludeExtraneousValues: true,
    };

    return plainToInstance(
      PhysiotherapistProfileDto,
      {
        ...physiotherapist,
        ...physiotherapist.applicationUser,
      },
      flags
    );
  }

  /**
   * Finds a physiotherapist by their unique ID.
   * @param id - The ID of the physiotherapist to look up.
   * @returns A promise that resolves to a PhysiotherapistDto if the physiotherapist is found.
   */
  async findPhysiotherapist(id: string) {
    const physiotherapist =
      await this.prisma.client.physiotherapist.findUniqueOrThrow({
        where: {
          applicationUserId: id,
        },
        include: {
          applicationUser: true,
        },
      });

    return this.mapPhysiotherapistToProfile(physiotherapist);
  }

  /**
   * Finds all physiotherapists with pagination and filter.
   * @param pagination - The pagination filter.
   * @param filter - The filter for the physiotherapists.
   * @returns A promise that resolves to a PaginatedOutput of PhysiotherapistDto,
   */
  async findAllPhysiotherapists(
    pagination: PaginationFilter,
    filter: PhysiotherapistFilter
  ) {
    const { searchText } = filter;

    const where: Prisma.PhysiotherapistWhereInput = {};

    if (searchText) {
      where.OR = [
        { specialization: { contains: searchText, mode: "insensitive" } },
        {
          applicationUser: {
            firstName: { contains: searchText, mode: "insensitive" },
            middleName: { contains: searchText, mode: "insensitive" },
            lastName: { contains: searchText, mode: "insensitive" },
          },
        },
      ];
    }

    return this.prisma.client.physiotherapist.paginate(
      pagination,
      { where, include: { applicationUser: true } },
      { mapFn: this.mapPhysiotherapistToProfile }
    );
  }
}
