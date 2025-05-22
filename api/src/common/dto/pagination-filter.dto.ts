import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsInt } from "class-validator";

export class PaginationFilter {
  @ApiProperty({ description: "Page", default: 0 })
  @IsInt()
  @IsDefined()
  @Type(() => Number)
  page: number;

  @ApiProperty({ description: "Page size", default: 10 })
  @IsInt()
  @IsDefined()
  @Type(() => Number)
  perPage: number;
}
