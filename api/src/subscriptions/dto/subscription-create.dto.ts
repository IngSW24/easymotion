import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class SubscriptionCreateDto {
  @ApiProperty({ description: "Subscribed course ID" })
  @IsString()
  @Expose()
  course_id: string;

  @ApiProperty({ description: "Subscribed user ID" })
  @IsString()
  @IsOptional()
  @Expose()
  patient_id: string;

  @ApiProperty({ description: "Subscription request message" })
  @IsString()
  @IsOptional()
  @Expose()
  subscriptionRequestMessage: string;
}
