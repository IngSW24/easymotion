import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCourseCategoryDto } from "./dto/create-category.dto";
import UseAuth from "src/auth/decorators/auth-with-role.decorator";
import { Role } from "@prisma/client";
import { UpdateCourseCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
@UseAuth([Role.ADMIN, Role.PHYSIOTHERAPIST])
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCourseCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateDto: UpdateCourseCategoryDto) {
    return this.categoriesService.update(id, updateDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
