import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";
import { PhysiotherapistDto } from "../physiotherapist/physiotherapist.dto";
import { Type, Expose } from "class-transformer";
import { IsOptional } from "class-validator";
import { PatientDto } from "../patient/patient.dto";

export class UpdatePhysiotherapistDto extends OmitType(PhysiotherapistDto, [
  "userId",
]) {}

export class UpdatePatientDto extends OmitType(PatientDto, ["userId"]) {}

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ["patient", "physiotherapist"])
) {
  @ApiProperty({
    description: "Physiotherapist data",
    type: UpdatePhysiotherapistDto,
    required: false,
  })
  @Type(() => UpdatePhysiotherapistDto)
  @IsOptional()
  @Expose()
  physiotherapist?: UpdatePhysiotherapistDto | null;

  @ApiProperty({
    description: "Patient data",
    type: UpdatePatientDto,
    required: false,
  })
  @Type(() => UpdatePatientDto)
  @IsOptional()
  @Expose()
  patient?: UpdatePatientDto | null;
}
