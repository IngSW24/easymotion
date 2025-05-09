import { IntersectionType, PickType } from "@nestjs/swagger";
import { PatientDto } from "./patient.dto";
import { ApplicationUserDto } from "../user/application-user.dto";

export class PatientProfileDto extends IntersectionType(
  PatientDto,
  PickType(ApplicationUserDto, [
    "createdAt",
    "lastLogin",
    "firstName",
    "middleName",
    "lastName",
    "picturePath",
    "birthDate",
    "phoneNumber",
    "email",
    "sex",
  ])
) {}
