-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BASIC', 'MEDIUM', 'ADVANCED');

-- CreateEnum
CREATE TYPE "PaymentRecurrence" AS ENUM ('SINGLE', 'PER_SESSION', 'MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'PHYSIOTHERAPIST');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "MobilityLevel" AS ENUM ('LIMITED', 'MODERATE', 'FULL');

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "location" TEXT,
    "instructors" TEXT[],
    "level" "CourseLevel" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "paymentRecurrence" "PaymentRecurrence" NOT NULL,
    "isPublished" BOOLEAN NOT NULL,
    "subscriptionsOpen" BOOLEAN NOT NULL,
    "maxSubscribers" INTEGER,
    "imagePath" TEXT,
    "tags" TEXT[],
    "categoryId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "subscriptionStartDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionEndDate" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSession" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "courseId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "isPending" BOOLEAN NOT NULL,
    "subscriptionRequestMessage" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("courseId","patientId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailConfirmationToken" TEXT,
    "emailConfirmationTokenExpiry" TIMESTAMP(3),
    "passwordHash" TEXT NOT NULL DEFAULT '',
    "passwordResetToken" TEXT,
    "passwordResetTokenExpiry" TIMESTAMP(3),
    "twoFactorCode" TEXT,
    "twoFactorExpiry" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "birthDate" TEXT,
    "lastLogin" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "picturePath" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Physiotherapist" (
    "bio" TEXT,
    "specialization" TEXT,
    "publicPhoneNumber" TEXT,
    "publicEmail" TEXT,
    "publicAddress" TEXT,
    "website" TEXT,
    "socialMediaLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Physiotherapist_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Patient" (
    "userId" TEXT NOT NULL,
    "sex" "Sex",
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "smoker" BOOLEAN,
    "alcoholUnits" INTEGER,
    "activityLevel" "ActivityLevel",
    "mobilityLevel" "MobilityLevel",
    "restingHeartRate" INTEGER,
    "bloodPressure" TEXT,
    "profession" TEXT,
    "sport" TEXT,
    "sportFrequency" INTEGER,
    "medications" TEXT,
    "allergies" TEXT,
    "otherPathologies" TEXT,
    "painZone" TEXT,
    "painIntensity" INTEGER,
    "painFrequency" TEXT,
    "painCharacteristics" TEXT,
    "painModifiers" TEXT,
    "sleepHours" INTEGER,
    "perceivedStress" INTEGER,
    "lastMedicalCheckup" TIMESTAMP(3),
    "personalGoals" TEXT,
    "notes" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CourseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Physiotherapist"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Physiotherapist" ADD CONSTRAINT "Physiotherapist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
