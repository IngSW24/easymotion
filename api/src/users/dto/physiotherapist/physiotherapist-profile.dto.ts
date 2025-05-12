import { IntersectionType, PickType } from "@nestjs/swagger";
import { PhysiotherapistDto } from "./physiotherapist.dto";
import { ApplicationUserDto } from "../user/application-user.dto";

/**
 * Represents the public profile of a physiotherapist.
 */
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
