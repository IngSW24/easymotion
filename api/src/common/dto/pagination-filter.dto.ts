import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationFilter {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? parseInt(value) : value
  )
  page?: number = 0;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string" ? parseInt(value) : value
  )
  perPage?: number = 10;
}
