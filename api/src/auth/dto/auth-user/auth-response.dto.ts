import { IsBoolean, IsOptional } from "class-validator";
import { BaseAuthUserDto } from "./auth-user.dto";
import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AccessTokenDto } from "../actions/access-token.dto";

export class AuthResponseDto {
  @ApiProperty({ description: "User related data" })
  @Expose()
  @IsOptional()
  @Type(() => BaseAuthUserDto)
  user?: BaseAuthUserDto;

  @ApiProperty({ description: "Access token and, eventually, refresh token" })
  @Expose()
  @IsOptional()
  @Type(() => AccessTokenDto)
  tokens?: AccessTokenDto;

  @ApiProperty({
    description: "Indicates if secondary OTP step is required",
  })
  @IsBoolean()
  @Expose()
  requiresOtp: boolean;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
