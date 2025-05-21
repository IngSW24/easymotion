import { OmitType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export default class UserCreateDto extends OmitType(UserDto, [
  "id",
  "physiotherapist",
  "patient",
]) {}
