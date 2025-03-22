import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail } from "class-validator";
import CheckPasswordConstraints from "src/auth/decorators/strong-password.decorator";

export class SignInDto {
  @ApiProperty({
    description: "Email address of the user",
    example: "admin@easymotion.it",
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    description: "Password of the user",
    example: "password",
  })
  @CheckPasswordConstraints()
  @Expose()
  password: string;
}
