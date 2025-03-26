import { Expose } from "class-transformer";
import { IsOptional, IsUUID } from "class-validator";

export class SubscribedQueryFilter {
  @Expose()
  @IsOptional()
  @IsUUID()
  userId?: string;
}
