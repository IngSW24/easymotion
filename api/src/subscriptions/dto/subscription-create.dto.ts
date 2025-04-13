import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class SubscriptionCreateDto {
  @ApiProperty({ description: "Date of subscription to the course" })
  @Type(() => Date)
  @IsDate()
  @Expose()
  @IsOptional()
  subscriptionDate?: Date;

  @ApiProperty({ description: "Subscribed course id" })
  @IsString()
  @Expose()
  courseId: string;

  @ApiProperty({ description: "Id of the user to subscribe (only for admins)" })
  @IsString()
  @Expose()
  @IsOptional()
  userId?: string;
}
