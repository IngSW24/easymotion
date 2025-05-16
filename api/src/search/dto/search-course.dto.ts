import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class SearchCourseDto {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "The ID of the course",
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "The name of the course",
  })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    description: "The category of the course",
  })
  @IsString()
  categoryName: string;

  @Expose()
  @ApiProperty({
    description: "The image of the course",
  })
  @IsString()
  imagePath: string | null;

  @Expose()
  @ApiProperty({
    description: "The number of subscriptions of the course",
  })
  @IsNumber()
  subscriptionCount: number;
}
