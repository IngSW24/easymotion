import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { AuthUserDto } from "./auth-user.dto";
import { Type, Expose } from "class-transformer";
import { IsOptional } from "class-validator";
import {
  UpdatePatientDto,
  UpdatePhysiotherapistDto,
} from "src/users/dto/user/update.user.dto";

export class UpdateAuthUserDto extends PartialType(
  OmitType(AuthUserDto, [
    "id",
    "role",
    "isEmailVerified",
    "email",
    "picturePath",
    "patient",
    "physiotherapist",
  ])
) {
  @ApiProperty({
    description: "Physiotherapist data",
    type: UpdatePhysiotherapistDto,
  })
  @Type(() => UpdatePhysiotherapistDto)
  @IsOptional()
  @Expose()
  physiotherapist?: UpdatePhysiotherapistDto | null;

  @ApiProperty({
    description: "Patient data",
    type: UpdatePatientDto,
  })
  @Type(() => UpdatePatientDto)
  @IsOptional()
  @Expose()
  patient?: UpdatePatientDto | null;
}
