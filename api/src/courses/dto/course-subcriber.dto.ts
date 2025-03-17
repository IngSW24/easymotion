import { PickType } from "@nestjs/swagger";
import { ApplicationUserDto } from "src/users/dto/application-user.dto";

export class CourseSubcriberDto extends PickType(ApplicationUserDto, [
  "id",
  "email",
  "firstName",
  "lastName",
  "middleName",
]) {}
