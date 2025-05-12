-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "alcoholUnits" INTEGER,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "medications" TEXT,
ADD COLUMN     "otherPathologies" TEXT,
ADD COLUMN     "painCharacteristics" TEXT,
ADD COLUMN     "painFrequency" TEXT,
ADD COLUMN     "painIntensity" INTEGER,
ADD COLUMN     "painModifiers" TEXT,
ADD COLUMN     "painZone" TEXT,
ADD COLUMN     "perceivedStress" INTEGER,
ADD COLUMN     "personalGoals" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "sex" "Sex",
ADD COLUMN     "sleepHours" INTEGER,
ADD COLUMN     "sport" TEXT,
ADD COLUMN     "sportFrequency" INTEGER;
