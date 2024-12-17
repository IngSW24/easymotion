-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('ACQUAGYM', 'CROSSFIT', 'PILATES', 'ZUMBA_FITNESS', 'POSTURAL_TRAINING', 'BODYWEIGHT_WORKOUT');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BASIC', 'MEDIUM', 'ADVANCED');

-- CreateEnum
CREATE TYPE "CourseFrequency" AS ENUM ('SINGLE_SESSION', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "CourseAvailability" AS ENUM ('ACTIVE', 'COMING_SOON', 'NO_LONGER_AVAILABLE');

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "location" TEXT,
    "schedule" TEXT[],
    "instructor" TEXT[],
    "category" "CourseCategory" NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "frequency" "CourseFrequency" NOT NULL,
    "session_duration" TEXT NOT NULL,
    "cost" DECIMAL(65,30),
    "discount" INTEGER,
    "availability" "CourseAvailability" NOT NULL,
    "highlighted_priority" INTEGER,
    "members_capacity" INTEGER,
    "num_registered_members" INTEGER,
    "tags" TEXT[],
    "thumbnail_path" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
