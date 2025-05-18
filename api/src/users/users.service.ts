import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/user/create-user.dto";
import { UpdateUserDto } from "./dto/user/update.user.dto";
import { UserManager } from "./user.manager";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { PaginatedOutput } from "src/common/dto/paginated-output.dto";
import { plainToInstance } from "class-transformer";
import { User } from "@prisma/client";
import UserCreateDto from "./dto/user/create.user.dto";
import { PhysiotherapistProfileDto } from "./dto/physiotherapist/physiotherapist-profile.dto";
import {
  EXTENDED_PRISMA_SERVICE,
  ExtendedPrismaService,
} from "src/common/prisma/pagination";
import { UserDto } from "./dto/user/user.dto";
import { PatientProfileDto } from "./dto/patient/patient-profile.dto";
import { FindProfileArgs, FindProfilesArgsMap } from "./types/types";
import { compile } from "handlebars";
import { promises as fs } from "fs";
import { join } from "path";

/**
 * The UsersService class provides high-level CRUD operations for Users,
 * delegating lower-level operations to the UserManager. It implements the CrudService
 * interface using CreateUserDto, UpdateUserDto, and UserDto.
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(EXTENDED_PRISMA_SERVICE)
    private readonly prisma: ExtendedPrismaService,
    private readonly userManager: UserManager
  ) {}

  /**
   * Creates a new user.
   * @param newUser - The DTO containing new user data (email, etc.) and password.
   * @returns A promise that resolves to an UserDto representing the created user.
   */
  async create(newUser: CreateUserDto): Promise<UserDto> {
    const mappedUser = plainToInstance(UserCreateDto, newUser, {
      excludeExtraneousValues: true,
    });

    const result = await this.userManager.createUser(
      { ...mappedUser, passwordHash: "" },
      newUser.password
    );

    return result;
  }

  /**
   * Retrieves a paginated list of users.
   * @param pagination - An object containing the current page and items per page.
   * @returns A promise that resolves to a PaginatedOutput of UserDto,
   *          including pagination metadata (e.g., total count, hasNextPage, etc.).
   */
  async findAll(
    pagination: PaginationFilter
  ): Promise<PaginatedOutput<UserDto>> {
    return this.prisma.client.user.paginate(
      pagination,
      {
        include: { physiotherapist: true, patient: true },
      },
      {
        mapType: UserDto,
      }
    );
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The user ID to look up.
   * @returns A promise that resolves to an UserDto if the user is found.
   */
  async findOne(id: string): Promise<UserDto> {
    const result = await this.userManager.getUserById(id);

    return plainToInstance(UserDto, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Finds a user by their email address.
   * @param email - The email to look up.
   * @returns A promise that resolves to an UserDto if the user is found.
   */
  async findOneByEmail(email: string): Promise<UserDto> {
    const result = await this.userManager.getUserByEmail(email);
    return plainToInstance(UserDto, result, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Updates a user with the provided data.
   * @param id - The ID of the user to update.
   * @param data - The DTO containing fields to update (e.g., firstName, lastName, etc.).
   * @returns A promise that resolves to an UserDto representing the updated user.
   */
  async update(id: string, data: UpdateUserDto): Promise<UserDto> {
    const result = await this.userManager.updateUser(id, data);

    return plainToInstance(UserDto, result, {
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

  /**
   * Finds a profile by its unique ID.
   * @param id - The ID of the profile to look up.
   * @param args - An object containing the type of profile and the DTO to map to.
   * @returns A promise that resolves to a PhysiotherapistProfileDto or PatientProfileDto.
   */
  async findProfile<T extends "physiotherapist" | "patient">(
    id: string,
    args: FindProfileArgs<T>
  ): Promise<
    T extends "physiotherapist" ? PhysiotherapistProfileDto : PatientProfileDto
  > {
    const client = this.prisma.client[args.type];

    let result: { user: User } | never;

    if (client === this.prisma.client.physiotherapist) {
      result = await client.findUniqueOrThrow({
        where: { userId: id },
        include: { user: true },
      });
    } else if (client === this.prisma.client.patient) {
      result = await client.findUniqueOrThrow({
        where: { userId: id },
        include: { user: true },
      });
    }

    return this.mapToProfile(
      args.dto as new () => unknown,
      result
    ) as T extends "physiotherapist"
      ? PhysiotherapistProfileDto
      : PatientProfileDto;
  }

  /**
   * Finds paginated profiles of a specific type.
   * @param pagination - The pagination filter for the paginated results.
   * @param args - The arguments for finding profiles, including the type and DTO.
   * @returns A promise that resolves to a paginated list of profiles of the specified type.
   */
  async findProfiles<T extends "physiotherapist" | "patient">(
    pagination: PaginationFilter,
    args: FindProfilesArgsMap<T>
  ): Promise<
    T extends "physiotherapist"
      ? PaginatedOutput<PhysiotherapistProfileDto>
      : PaginatedOutput<PatientProfileDto>
  > {
    const client = this.prisma.client[args.type];

    return client.paginate(
      pagination,
      {
        where: args.searchText
          ? {
              user: {
                OR: [
                  {
                    firstName: {
                      contains: args.searchText,
                      mode: "insensitive",
                    },
                  },
                  {
                    lastName: {
                      contains: args.searchText,
                      mode: "insensitive",
                    },
                  },
                  {
                    middleName: {
                      contains: args.searchText,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            }
          : undefined,
        include: { user: true },
      },
      {
        mapFn: (o) => this.mapToProfile(args.dto as new () => unknown, o),
      }
    );
  }

  async findMedicalHistory(id: string): Promise<string> {
    const result = await this.prisma.client.patient.findUniqueOrThrow({
      where: { userId: id },
      include: { user: true },
    });

    const profile = this.mapToProfile(PatientProfileDto, result);

    const template = await fs.readFile(
      join(__dirname, "..", "..", "public", "medical_history.hbs")
    );
    const html = compile(template.toString())(profile);
    return html;

    /*await html2pdf.createPDF(html, {
      format: "A4",
      filePath: "output.pdf",
      landscape: false,
      resolution: {
        width: 1920,
        height: 1080,
      },
    });

    return await createPdf(
      join(process.cwd(), "views", "medical_history.hbs"),
      {},
      profile
    );*/
  }

  /**
   * Maps a profile to a DTO.
   * @param type - The DTO type to map to.
   * @param profile - The profile to map.
   * @returns A promise that resolves to a DTO.
   */
  private mapToProfile<T extends { user: User }, K>(
    type: new () => K,
    profile: T
  ) {
    const { user, ...rest } = profile;

    return plainToInstance(
      type,
      {
        ...rest,
        ...user,
      },
      { excludeExtraneousValues: true }
    );
  }
}
