import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class PhysiotherapistFilter {
  @Expose()
  @IsOptional()
  @IsString()
  searchText?: string;
}
