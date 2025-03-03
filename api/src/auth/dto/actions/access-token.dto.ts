import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class AccessTokenDto {
  @ApiProperty({
    description: "The access token",
  })
  @IsString()
  @Expose()
  accessToken: string;

  @ApiProperty({
    description: "Indicates if secondary OTP step is required",
  })
  @IsBoolean()
  @Expose()
  requiresOtp: boolean;
}
