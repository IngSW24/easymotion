import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class TextDto {
  @ApiProperty({ description: "text exchanged with the model" })
  @IsString()
  @Expose()
  text: string;
}
