import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class ProfilesFilter {
  @Expose()
  @IsOptional()
  @IsString()
  searchText?: string;
}
