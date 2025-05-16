import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class SubscriptionRequestDto {
  @ApiProperty({ description: "Course ID of the subscription request" })
  @IsString()
  @Expose()
  course_id: string;

  @ApiProperty({ description: "Subscription request message" })
  @IsString()
  @IsOptional()
  @Expose()
  subscriptionRequestMessage: string;
}

export class SubscriptionCreateDto {
  @ApiProperty({ description: "Subscribed course ID" })
  @IsString()
  @Expose()
  course_id: string;

  @ApiProperty({ description: "Subscribed user ID" })
  @IsString()
  @Expose()
  patient_id: string;
}
