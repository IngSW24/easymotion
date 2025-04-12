import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import CheckPasswordConstraints from "src/auth/decorators/strong-password.decorator";

export class PasswordUpdateDto {
  @ApiProperty({
    name: "userId",
    description: "User ID of the user to reset the password",
  })
  @IsString()
  @Expose()
  userId: string;

  @ApiProperty({
    name: "token",
    description: "Token to reset the password",
  })
  @IsString()
  @Expose()
  token: string;

  @ApiProperty({
    name: "newPassword",
    description: "New password for the user",
  })
  @CheckPasswordConstraints()
  @Expose()
  newPassword: string;
}
