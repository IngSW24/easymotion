import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsDate } from "class-validator";
import { CourseDto } from "src/courses/dto/course.dto";
import { ApplicationUserDto } from "src/users/dto/application-user.dto";

export class SubscriptionUserDto extends PickType(ApplicationUserDto, [
  "id",
  "email",
  "firstName",
  "lastName",
  "middleName",
]) {}

export class SubscriptionCourseDto extends PickType(CourseDto, [
  "id",
  "name",
]) {}

export class SubscriptionDto {
  @ApiProperty({ description: "Course to which the user is subscribed" })
  @Expose()
  @Type(() => SubscriptionCourseDto)
  course: SubscriptionCourseDto;

  @ApiProperty({ description: "Date of subscription to the course" })
  @IsDate()
  @Expose()
  subscriptionDate: Date;
}

export class UserSubscriptionDto extends SubscriptionDto {
  @ApiProperty({ description: "Subscribed user" })
  @Expose()
  @Type(() => SubscriptionUserDto)
  user: SubscriptionUserDto;
}
