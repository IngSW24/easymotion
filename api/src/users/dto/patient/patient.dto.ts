import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Patient } from "@prisma/client";
import { Expose } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

/**
 * Represents the patient-specific data for the application user.
 */
export class PatientDto implements Patient {
  @ApiProperty({
    description: "Sex of the user",
    required: false,
    enum: $Enums.Sex,
  })
  @IsOptional()
  @Expose()
  sex: $Enums.Sex | null;

  @ApiProperty({ description: "Height in cm", required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  height: number | null;

  @ApiProperty({ description: "Weight in kg", required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  weight: number | null;

  @ApiProperty({ description: "Smoker", required: false })
  @IsBoolean()
  @IsOptional()
  @Expose()
  smoker: boolean | null;

  @ApiProperty({
    description: "Alcohol consumption (integer)",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  alcoholUnits: number | null;

  @ApiProperty({
    description: "Activity level",
    required: false,
    enum: $Enums.ActivityLevel,
  })
  @IsOptional()
  @Expose()
  activityLevel: $Enums.ActivityLevel | null;

  @ApiProperty({
    description: "Mobility level",
    required: false,
    enum: $Enums.MobilityLevel,
  })
  @IsOptional()
  @Expose()
  mobilityLevel: $Enums.MobilityLevel | null;

  @ApiProperty({ description: "Resting heart rate", required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  restingHeartRate: number | null;

  @ApiProperty({ description: "Blood pressure", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  bloodPressure: string | null;

  @ApiProperty({ description: "Profession", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  profession: string | null;

  @ApiProperty({ description: "Sport", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  sport: string | null;

  @ApiProperty({ description: "Sport frequency", required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  sportFrequency: number | null;

  @ApiProperty({ description: "Medications", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  medications: string | null;

  @ApiProperty({ description: "Allergies", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  allergies: string | null;

  @ApiProperty({
    description: "Other concomitant pathologies",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  otherPathologies: string | null;

  @ApiProperty({ description: "Pain zone", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  painZone: string | null;

  @ApiProperty({ description: "Pain intensity", required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  painIntensity: number | null;

  @ApiProperty({ description: "Pain frequency", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  painFrequency: string | null;

  @ApiProperty({ description: "Pain characteristics", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  painCharacteristics: string | null;

  @ApiProperty({
    description: "Aspects that modify the intensity of pain",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  painModifiers: string | null;

  @ApiProperty({ description: "Sleep hours", required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  sleepHours: number | null;

  @ApiProperty({ description: "Perceived stress", required: false })
  @IsNumber()
  @IsOptional()
  @Expose()
  perceivedStress: number | null;

  @ApiProperty({ description: "Last medical checkup", required: false })
  @IsDate()
  @IsOptional()
  @Expose()
  lastMedicalCheckup: Date | null;

  @ApiProperty({ description: "Personal goals", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  personalGoals: string | null;

  @ApiProperty({ description: "Notes", required: false })
  @IsString()
  @IsOptional()
  @Expose()
  notes: string | null;

  @ApiProperty({
    description: "User ID",
    example: "b3bf4d18-8dd0-43a1-b1da-fd3f7b9553a1",
  })
  @IsString()
  @IsDefined()
  @Expose()
  userId: string;
}
