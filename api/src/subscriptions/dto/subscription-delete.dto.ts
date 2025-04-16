import { PickType } from "@nestjs/swagger";
import { SubscriptionCreateDto } from "./subscription-create.dto";

export class SubscriptionDeleteDto extends PickType(SubscriptionCreateDto, [
  "course_id",
  "patient_id",
]) {}
