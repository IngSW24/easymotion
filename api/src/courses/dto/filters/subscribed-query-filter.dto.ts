import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class SubscribedQueryFilter {
  @Expose()
  @IsOptional()
  @IsString()
  userId?: string;
}
