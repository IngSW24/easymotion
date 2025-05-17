import { IntersectionType, PickType } from "@nestjs/swagger";
import { PatientDto } from "./patient.dto";
import { UserDto } from "../user/user.dto";

export class PatientProfileDto extends IntersectionType(
  PatientDto,
  PickType(UserDto, [
    "createdAt",
    "lastLogin",
    "firstName",
    "middleName",
    "lastName",
    "picturePath",
    "birthDate",
    "phoneNumber",
    "email",
  ])
) {}
