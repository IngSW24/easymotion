import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean } from "class-validator";

export class OtpSwitchDto {
  @ApiProperty({
    name: "enabled",
    description: "Indicates if the OTP is enabled",
  })
  @IsBoolean()
  @Expose()
  enabled: boolean;
}
