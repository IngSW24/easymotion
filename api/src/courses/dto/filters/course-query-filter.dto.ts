import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class CourseQueryFilter {
  @Expose()
  @IsOptional()
  @IsString()
  ownerId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  searchText?: string;

  @Expose()
  @IsOptional()
  @IsString()
  categoryIds?: string;

  @Expose()
  @IsOptional()
  @IsString()
  level?: string;
}
