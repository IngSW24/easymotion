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

  @ApiProperty({ description: "Last medical checkup" })
  @IsDate()
  @Expose()
  lastMedicalCheckup: Date | null;

  @ApiProperty({ description: "Notes" })
  @IsString()
  @Expose()
  notes: string | null;

  @Exclude()
  applicationUserId: string;
}
