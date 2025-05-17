import { ApiHideProperty, ApiProperty, PickType } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";
import { CourseDto } from "src/courses/dto/course.dto";
import { UserDto } from "src/users/dto/user/user.dto";
import { Subscription } from "@prisma/client";

export class SubscriptionUserDto extends PickType(UserDto, [
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

export class SubscriptionDtoWithCourse implements Subscription {
  @ApiProperty({ description: "Creation date" })
  @Type(() => Date)
  @IsDate()
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: "Update date" })
  @Type(() => Date)
  @IsDate()
  @Expose()
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  courseId: string;

  @ApiHideProperty()
  @Exclude()
  patientId: string;

  @ApiHideProperty()
  @Exclude() // should be filtered by 2 endpoints
  isPending: boolean;

  @ApiProperty({ description: "Subscription request message", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  subscriptionRequestMessage: string | null;

  // extra

  @ApiProperty({ description: "Course id and name" })
  @Type(() => SubscriptionCourseDto)
  @Expose()
  course: SubscriptionCourseDto;
}

export class SubscriptionDtoWithUser extends SubscriptionDtoWithCourse {
  @ApiProperty({ description: "Subscribed user" })
  @Expose()
  @Type(() => SubscriptionUserDto)
  user: SubscriptionUserDto;
}
