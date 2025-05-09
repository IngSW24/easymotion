import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Patient } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from "class-validator";

/**
 * Represents the patient-specific data for the application user.
 */
export class PatientDto implements Patient {
  @ApiProperty({ description: "Height in cm" })
  @IsNumber()
  @Expose()
  heightCm: number | null;

  @ApiProperty({ description: "Weight in kg" })
  @IsNumber()
  @Expose()
  weightKg: number | null;

  @ApiProperty({ description: "Smoker" })
  @IsBoolean()
  @Expose()
  smoker: boolean | null;

  @ApiProperty({ description: "Alcohol consumption (integer)" })
  @IsNumber()
  @Expose()
  alcohol: number | null;

  @ApiProperty({ description: "Activity level" })
  @IsEnum($Enums.ActivityLevel)
  @Expose()
  activityLevel: $Enums.ActivityLevel | null;

  @ApiProperty({ description: "Mobility level" })
  @IsEnum($Enums.MobilityLevel)
  @Expose()
  mobilityLevel: $Enums.MobilityLevel | null;

  @ApiProperty({ description: "Resting heart rate" })
  @IsNumber()
  @Expose()
  restingHeartRate: number | null;

  @ApiProperty({ description: "Blood pressure" })
  @IsString()
  @Expose()
  bloodPressure: string | null;

  @ApiProperty({ description: "Profession" })
  @IsString()
  @Expose()
  profession: string | null;

  @ApiProperty({ description: "Drugs" })
  @IsString()
  @Expose()
  drugs: string | null;

  @ApiProperty({ description: "Allergies" })
  @IsString()
  @Expose()
  allergies: string | null;

  @ApiProperty({ description: "Other concomitant pathologies" })
  @IsString()
  @Expose()
  otherPathologies: string | null;

  @ApiProperty({ description: "Pain zone" })
  @IsString()
  @Expose()
  painZone: string | null;

  @ApiProperty({ description: "Pain intensity" })
  @IsNumber()
  @Expose()
  painIntensity: number | null;

  @ApiProperty({ description: "Pain frequency" })
  @IsEnum($Enums.PainFrequency)
  @Expose()
  painFrequency: $Enums.PainFrequency | null;

  @ApiProperty({ description: "Pain characteristics" })
  @IsString()
  @Expose()
  painCharacteristics: string | null;

  @ApiProperty({ description: "Aspects that modify the intensity of pain" })
  @IsString()
  @Expose()
  painModifiers: string | null;

  @ApiProperty({ description: "Sleep hours" })
  @IsNumber()
  @Expose()
  sleepHours: number | null;

  @ApiProperty({ description: "Perceived stress" })
  @IsNumber()
  @Expose()
  perceivedStress: number | null;

  @ApiProperty({ description: "Last medical checkup" })
  @IsDate()
  @Expose()
  lastMedicalCheckup: Date | null;

  @ApiProperty({ description: "Personal goals" })
  @IsString()
  @Expose()
  personalGoals: string | null;

  @ApiProperty({ description: "Notes" })
  @IsString()
  @Expose()
  notes: string | null;

  @Exclude()
  applicationUserId: string;
}
