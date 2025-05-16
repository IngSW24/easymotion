import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class SearchFilter {
  @Expose()
  @IsString()
  query: string;
}
