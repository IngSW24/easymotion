import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsStrongPassword } from "class-validator";

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
  // TODO: Change with NestJS Config
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  @Expose()
  password: string;
}
