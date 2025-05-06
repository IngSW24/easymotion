import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class SearchPhysiotherapistDto {
  @Expose()
  @ApiProperty({
    description: "The ID of the physiotherapist",
  })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    description: "The full name of the physiotherapist",
  })
  @IsString()
  fullName: string;

  @Expose()
  @ApiProperty({
    description: "The specialization of the physiotherapist",
  })
  @IsString()
  specialization: string;

  @Expose()
  @ApiProperty({
    description: "The address of the physiotherapist",
  })
  @IsString()
  address: string;

  @Expose()
  @ApiProperty({
    description: "The number of courses the physiotherapist is involved in",
  })
  @IsNumber()
  numberOfCourses: number;

  @Expose()
  @ApiProperty({
    description: "The picture path of the physiotherapist",
  })
  @IsString()
  picturePath: string | null;
}
