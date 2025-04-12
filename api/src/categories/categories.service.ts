import { Injectable } from "@nestjs/common";
import { CreateCourseCategoryDto } from "./dto/create-category.dto";
import { PrismaService } from "nestjs-prisma";
import { UpdateCourseCategoryDto } from "./dto/update-category.dto";
import { plainToInstance } from "class-transformer";
import { CourseCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCourseCategoryDto: CreateCourseCategoryDto) {
    const result = await this.prismaService.courseCategory.create({
      data: createCourseCategoryDto,
    });

    return plainToInstance(CourseCategoryDto, result);
  }

  async findAll() {
    const result = await this.prismaService.courseCategory.findMany();
    return result.map((x) => plainToInstance(CourseCategoryDto, x));
  }

  async findOne(id: string) {
    const result = await this.prismaService.courseCategory.findUniqueOrThrow({
      where: { id },
    });

    return plainToInstance(CourseCategoryDto, result);
  }

  async update(id: string, updateCategoryDto: UpdateCourseCategoryDto) {
    const result = await this.prismaService.courseCategory.update({
      where: { id },
      data: updateCategoryDto,
    });

    return plainToInstance(CourseCategoryDto, result);
  }

  remove(id: string) {
    return this.prismaService.courseCategory.delete({
      where: { id },
    });
  }
}
