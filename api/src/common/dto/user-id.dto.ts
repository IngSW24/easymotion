import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class UserIdDto {
  @Expose()
  @ApiProperty({ description: "The user ID" })
  @IsString()
  userId: string;
}
