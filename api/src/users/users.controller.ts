import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  SerializeOptions,
  Render,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/user/create-user.dto";
import { UpdateUserDto } from "./dto/user/update.user.dto";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { Role } from "@prisma/client";
import { ProfilesFilter } from "./filters/profiles-filter.dto";
import { PhysiotherapistProfileDto } from "./dto/physiotherapist/physiotherapist-profile.dto";
import { UserDto } from "./dto/user/user.dto";
import { PatientProfileDto } from "./dto/patient/patient-profile.dto";

/**
 * A controller for managing user-related operations, providing
 * standard CRUD endpoints for creating, reading, updating, and deleting users.
 */
@ApiTags("Users")
@Controller("users")
@SerializeOptions({ type: UserDto })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("physiotherapists")
  @ApiPaginatedResponse(PhysiotherapistProfileDto)
  @UseAuth()
  findAllPhysiotherapists(
    @Query() pagination: PaginationFilter,
    @Query() filter: ProfilesFilter
  ) {
    const { searchText } = filter;

    return this.usersService.findProfiles(pagination, {
      type: "physiotherapist",
      dto: PhysiotherapistProfileDto,
      searchText,
    });
  }

  @Get("physiotherapists/:id")
  @SerializeOptions({ type: PhysiotherapistProfileDto })
  @ApiOkResponse({ type: PhysiotherapistProfileDto })
  @UseAuth()
  findPhysiotherapist(@Param("id") id: string) {
    return this.usersService.findProfile(id, {
      type: "physiotherapist",
      dto: PhysiotherapistProfileDto,
    });
  }

  @Get("patients")
  @ApiPaginatedResponse(PatientProfileDto)
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  findAllPatients(
    @Query() pagination: PaginationFilter,
    @Query() filter: ProfilesFilter
  ) {
    const { searchText } = filter;
    return this.usersService.findProfiles(pagination, {
      type: "patient",
      dto: PatientProfileDto,
      searchText,
    });
  }

  @Get("patient/:id")
  @SerializeOptions({ type: PatientProfileDto })
  @ApiOkResponse({ type: PatientProfileDto })
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  findPatient(@Param("id") id: string) {
    return this.usersService.findProfile(id, {
      type: "patient",
      dto: PatientProfileDto,
    });
  }

  @Get("patient/medical_history/:id")
  @Render("medical_history")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  findMedicalHistory(@Param("id") id: string) {
    return this.usersService.findMedicalHistory(id);
  }

  /**
   * Create a new user.
   * @param createUserDto - The DTO containing user creation data (e.g., email, password).
   * @returns The created user as UserDto.
   */
  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @UseAuth([Role.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieve a paginated list of users.
   * @param pagination - The pagination filters: page, perPage, etc.
   * @returns A paginated response containing UserDto items.
   */
  @Get()
  @ApiPaginatedResponse(UserDto)
  @UseAuth([Role.ADMIN])
  findAll(@Query() pagination: PaginationFilter) {
    return this.usersService.findAll(pagination);
  }

  /**
   * Retrieve a single user by its unique ID.
   * @param id - The UUID of the user.
   * @returns The user as UserDto, if found.
   */
  @Get(":id")
  @ApiOkResponse({ type: UserDto })
  @UseAuth([Role.ADMIN])
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Update a user by its unique ID.
   * @param id - The UUID of the user.
   * @param updateUserDto - The fields to update (e.g., firstName, lastName).
   * @returns The updated user as UserDto.
   */
  @Put(":id")
  @ApiOkResponse({ type: UserDto })
  @UseAuth([Role.ADMIN])
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete a user by its unique ID.
   * @param id - The UUID of the user.
   */
  @Delete(":id")
  @ApiOkResponse()
  @UseAuth([Role.ADMIN])
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
