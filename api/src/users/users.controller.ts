import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApplicationUserDto } from "./dto/application-user.dto";
import { PaginationFilter } from "src/common/dto/pagination-filter.dto";
import { ApiPaginatedResponse } from "src/common/decorators/api-paginated-response.decorator";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";

/**
 * A controller for managing user-related operations, providing
 * standard CRUD endpoints for creating, reading, updating, and deleting users.
 */
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user.
   * @param createUserDto - The DTO containing user creation data (e.g., email, password).
   * @returns The created user as ApplicationUserDto.
   */
  @UseAuth(["admin"])
  @Post()
  @ApiCreatedResponse({ type: ApplicationUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieve a paginated list of users.
   * @param pagination - The pagination filters: page, perPage, etc.
   * @returns A paginated response containing ApplicationUserDto items.
   */
  @UseAuth(["admin"])
  @Get()
  @ApiPaginatedResponse(ApplicationUserDto)
  findAll(@Query() pagination: PaginationFilter) {
    return this.usersService.findAll(pagination);
  }

  /**
   * Retrieve a single user by its unique ID.
   * @param id - The UUID of the user.
   * @returns The user as ApplicationUserDto, if found.
   */
  @UseAuth(["admin"])
  @Get(":id")
  @ApiOkResponse({ type: ApplicationUserDto })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Update a user by its unique ID.
   * @param id - The UUID of the user.
   * @param updateUserDto - The fields to update (e.g., firstName, lastName).
   * @returns The updated user as ApplicationUserDto.
   */
  @UseAuth(["admin"])
  @Put(":id")
  @ApiOkResponse({ type: ApplicationUserDto })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete a user by its unique ID.
   * @param id - The UUID of the user.
   */
  @UseAuth(["admin"])
  @Delete(":id")
  @ApiOkResponse()
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
