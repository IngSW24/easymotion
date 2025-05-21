import { Physiotherapist } from "@prisma/client";
import { Expose } from "class-transformer";
import { IsString, IsArray, IsDefined } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Represents the physiotherapist-specific data for the application user.
 */
export class PhysiotherapistDto implements Physiotherapist {
  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: "The bio of the physiotherapist",
    example: "I am a physiotherapist with a passion for helping people",
  })
  bio: string | null;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: "The specialization of the physiotherapist",
    example: "I am a physiotherapist with a passion for helping people",
  })
  specialization: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: "The public phone number of the physiotherapist",
    example: "1234567890",
  })
  publicPhoneNumber: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: "The public email of the physiotherapist",
    example: "physio@example.com",
  })
  publicEmail: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: "The public address of the physiotherapist",
    example: "123 Main St, Anytown, USA",
  })
  publicAddress: string;

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: "The website of the physiotherapist",
    example: "https://www.physio.com",
  })
  website: string;

  @Expose()
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: "The social media links of the physiotherapist",
    example: [
      "https://www.facebook.com/physio",
      "https://www.instagram.com/physio",
    ],
  })
  socialMediaLinks: string[];

  @Expose()
  @IsDefined()
  @IsString()
  @ApiProperty({
    description: "User ID",
    example: "b3bf4d18-8dd0-43a1-b1da-fd3f7b9553a1",
  })
  userId: string;
}
