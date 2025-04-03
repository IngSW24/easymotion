import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class AccessTokenDto {
  @ApiProperty({
    description: "The access token",
  })
  @IsString()
  @Expose()
  accessToken: string;

  @ApiProperty({
    description: "The access token (if not using a web auth flow)",
  })
  @IsString()
  @Expose()
  @IsOptional()
  refreshToken?: string;
}
