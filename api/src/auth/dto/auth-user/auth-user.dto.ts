import { IntersectionType, PickType } from "@nestjs/swagger";
import { ApplicationUserDto } from "src/users/dto/application-user.dto";

export class BaseAuthUserDto extends PickType(ApplicationUserDto, [
  "id",
  "birthDate",
  "email",
  "firstName",
  "middleName",
  "picturePath",
  "lastName",
  "phoneNumber",
  "role",
  "isEmailVerified",
  "twoFactorEnabled",
]) {}

export class AuthUserDto extends IntersectionType(
  BaseAuthUserDto,
  PickType(ApplicationUserDto, ["physiotherapist"])
) {}
