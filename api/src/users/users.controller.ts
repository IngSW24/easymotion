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
  Inject,
  BadRequestException,
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
import { HttpService } from "@nestjs/axios";
import { ConfigType } from "@nestjs/config";
import pdfConfig from "src/config/pdf.config";

/**
 * A controller for managing user-related operations, providing
 * standard CRUD endpoints for creating, reading, updating, and deleting users.
 */
@ApiTags("Users")
@Controller("users")
@SerializeOptions({ type: UserDto })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private httpService: HttpService,
    @Inject(pdfConfig.KEY) private readonly config: ConfigType<typeof pdfConfig>
  ) {}

  /**
   * Fetch a paginated list of physiotherapists
   * @param pagination Pagination
   * @param filter Filters
   * @returns Paginated list of physiotherapists
   */
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

  /**
   * Fetch a physiotherapist profile
   * @param id User ID
   * @returns The physiotherapist profile
   */
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

  /**
   * Fetch a paginated list of patients
   * @param pagination Pagination
   * @param filter Filters
   * @returns Paginated list of patients
   */
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

  /**
   * Fetch a patient profile
   * @param id User ID
   * @returns The patient profile
   */
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

  /**
   * Create a PDF for the patient medical history
   * @param id User ID
   * @returns
   */
  @Get("patient/medical_history/:id")
  @UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
  async findMedicalHistory(@Param("id") id: string) {
    const html = await this.usersService.findMedicalHistory(id);

    const formData = new FormData();
    formData.append("Resource", new Blob([html]));
    //formData.append("Instructions", html);

    console.log(this.config.pdf_api_key);
    try {
      return this.httpService.postForm("https://api.dpdf.io/v1.0/pdf", {
        // TODO: 401 invalid API key
        headers: {
          Authorization: "Bearer " + this.config.pdf_api_key,
          "Content-Type": "multipart/form-data",
        },
        //formData,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
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
