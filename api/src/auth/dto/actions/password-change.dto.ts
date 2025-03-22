import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import CheckPasswordConstraints from "src/auth/decorators/strong-password.decorator";

export class PasswordChangeDto {
  @ApiProperty({
    description: "The previous password",
  })
  @IsString()
  @Expose()
  oldPassword: string;

  @ApiProperty({
    description: "The new password",
  })
  @CheckPasswordConstraints()
  @Expose()
  newPassword: string;
}
