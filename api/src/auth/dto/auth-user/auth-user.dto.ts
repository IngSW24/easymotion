import { IntersectionType, PickType } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user/user.dto";

export class BaseAuthUserDto extends PickType(UserDto, [
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
  PickType(UserDto, ["physiotherapist", "patient"])
) {}
