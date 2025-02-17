import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

export class OtpLoginDto {
  @ApiProperty({
    name: "userId",
    description: "User ID of the user",
  })
  @IsUUID()
  @Expose()
  userId: string;

  @ApiProperty({
    name: "otp",
    description: "One-time password",
  })
  @IsString()
  @Expose()
  otp: string;
}
