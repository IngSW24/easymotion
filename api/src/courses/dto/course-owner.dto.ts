import { PickType } from "@nestjs/swagger";
import { UserDto } from "src/users/dto/user/user.dto";

export class CourseOwnerDto extends PickType(UserDto, [
  "id",
  "email",
  "firstName",
  "lastName",
  "middleName",
]) {}
