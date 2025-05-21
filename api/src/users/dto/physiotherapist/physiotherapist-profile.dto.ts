import { IntersectionType, PickType } from "@nestjs/swagger";
import { PhysiotherapistDto } from "./physiotherapist.dto";
import { UserDto } from "../user/user.dto";

/**
 * Represents the public profile of a physiotherapist.
 */
export class PhysiotherapistProfileDto extends IntersectionType(
  PhysiotherapistDto,
  PickType(UserDto, [
    "createdAt",
    "lastLogin",
    "firstName",
    "middleName",
    "lastName",
    "picturePath",
  ])
) {}
