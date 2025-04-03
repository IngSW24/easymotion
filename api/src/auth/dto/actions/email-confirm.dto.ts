import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import { EmailDto } from "./email.dto";

export class EmailConfirmDto extends EmailDto {
  @ApiProperty({
    description: "Token sent to the user",
    example: "00000000-0000-0000-0000-000000000000",
  })
  @IsString()
  @Expose()
  token: string;

  @ApiProperty({
    description: "User ID of the user to confirm the email",
    example: "00000000-0000-0000-0000-000000000000",
  })
  @IsString()
  @Expose()
  userId: string;
}
