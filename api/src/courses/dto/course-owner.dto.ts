import { PickType } from "@nestjs/swagger";
import { ApplicationUserDto } from "src/users/dto/user/application-user.dto";

export class CourseOwnerDto extends PickType(ApplicationUserDto, [
  "id",
  "email",
  "firstName",
  "lastName",
  "middleName",
]) {}
