import { OmitType, PartialType } from "@nestjs/swagger";
import { AuthUserDto } from "./auth-user.dto";

export class UpdateAuthUserDto extends PartialType(
  OmitType(AuthUserDto, [
    "id",
    "role",
    "isEmailVerified",
    "email",
    "picturePath",
  ])
) {}
