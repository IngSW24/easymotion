import { Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";

export class CourseQueryFilter {
  @Expose()
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
