import { IntersectionType, PickType } from "@nestjs/swagger";
import { PhysiotherapistDto } from "./physiotherapist.dto";
import { ApplicationUserDto } from "./application-user.dto";

export class PhysiotherapistProfileDto extends IntersectionType(
  PhysiotherapistDto,
  PickType(ApplicationUserDto, [
    "createdAt",
    "lastLogin",
    "firstName",
    "middleName",
    "lastName",
    "picturePath",
  ])
) {}
