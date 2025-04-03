import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class OtpLoginDto {
  @ApiProperty({
    name: "email",
    description: "User email used for first login step",
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    name: "otp",
    description: "One-time password",
  })
  @IsString()
  @Expose()
  otp: string;
}
