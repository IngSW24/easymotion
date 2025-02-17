import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail } from "class-validator";

export class EmailDto {
  @ApiProperty({
    description: "Email address of the user",
    example: "user@easymotion.it",
  })
  @IsEmail()
  @Expose()
  email: string;
}
