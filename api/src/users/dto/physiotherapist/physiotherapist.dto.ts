import { Physiotherapist } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { IsString, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Represents the physiotherapist-specific data for the application user.
 */
export class PhysiotherapistDto implements Physiotherapist {
  @Expose()
  @IsString()
  @ApiProperty({
    description: "The bio of the physiotherapist",
    example: "I am a physiotherapist with a passion for helping people",
  })
  bio: string | null;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The specialization of the physiotherapist",
    example: "I am a physiotherapist with a passion for helping people",
  })
  specialization: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The public phone number of the physiotherapist",
    example: "1234567890",
  })
  publicPhoneNumber: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The public email of the physiotherapist",
    example: "physio@example.com",
  })
  publicEmail: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The public address of the physiotherapist",
    example: "123 Main St, Anytown, USA",
  })
  publicAddress: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: "The website of the physiotherapist",
    example: "https://www.physio.com",
  })
  website: string;

  @Expose()
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

  @Exclude()
  applicationUserId: string;
}
