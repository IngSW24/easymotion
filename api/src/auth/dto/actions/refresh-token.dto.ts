import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({
    description:
      "The refresh token (no need to specify in case of a web auth flow)",
  })
  @IsString()
  @IsOptional()
  @Expose()
  refreshToken?: string;
}
