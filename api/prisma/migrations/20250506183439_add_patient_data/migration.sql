-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "MobilityLevel" AS ENUM ('LIMITED', 'MODERATE', 'FULL');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "activityLevel" "ActivityLevel",
ADD COLUMN     "bloodPressure" TEXT,
ADD COLUMN     "heightCm" DOUBLE PRECISION,
ADD COLUMN     "lastMedicalCheckup" TIMESTAMP(3),
ADD COLUMN     "mobilityLevel" "MobilityLevel",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "restingHeartRate" INTEGER,
ADD COLUMN     "smoker" BOOLEAN,
ADD COLUMN     "weightKg" DOUBLE PRECISION;
