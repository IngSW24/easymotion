import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsDate } from "class-validator";
import { ApplicationUserDto } from "src/users/dto/application-user.dto";

export class CourseSubcriberDto extends PickType(ApplicationUserDto, [
  "id",
  "email",
  "firstName",
  "lastName",
  "middleName",
]) {
  @ApiProperty({ description: "Date of subscription to the course" })
  @IsDate()
  @Expose()
  subscriptionDate: Date;
}
