import { ApiProperty, PickType } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";
import { CourseDto } from "src/courses/dto/course.dto";
import { ApplicationUserDto } from "src/users/dto/application-user.dto";
import { Subscription } from "@prisma/client";

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

export class SubscriptionDtoWithCourse implements Subscription {
  @ApiProperty({ description: "Creation date" })
  @Type(() => Date)
  @IsDate()
  @Expose()
  created_at: Date;

  @ApiProperty({ description: "Update date" })
  @Type(() => Date)
  @IsDate()
  @Expose()
  updated_at: Date;

  @Exclude()
  course_id: string;

  @Exclude()
  patient_id: string;

  @Exclude() // should be filtered by 2 endpoints
  isPending: boolean;

  @ApiProperty({ description: "Subscription request message" })
  @IsString()
  @IsOptional()
  @Expose()
  subscriptionRequestMessage: string;

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
