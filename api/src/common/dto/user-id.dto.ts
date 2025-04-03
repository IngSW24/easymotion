import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsUUID } from "class-validator";

export class UserIdDto {
  @Expose()
  @ApiProperty({ description: "The user ID" })
  @IsUUID()
  userId: string;
}
