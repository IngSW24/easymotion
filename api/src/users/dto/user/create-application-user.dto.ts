import { OmitType } from "@nestjs/swagger";
import { ApplicationUserDto } from "./application-user.dto";

export default class ApplicationUserCreateDto extends OmitType(
  ApplicationUserDto,
  ["id", "physiotherapist"]
) {}
