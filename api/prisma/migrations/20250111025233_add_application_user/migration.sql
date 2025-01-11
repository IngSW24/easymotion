-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'PHYSIOTHERAPIST');

-- CreateTable
CREATE TABLE "ApplicationUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailConfirmationToken" TEXT,
    "emailConfirmationTokenExpiry" TIMESTAMP(3),
    "passwordHash" TEXT NOT NULL DEFAULT '',
    "passwordResetToken" TEXT,
    "passwordResetTokenExpiry" TIMESTAMP(3),
    "twoFactorCode" TEXT,
    "twoFactorExpiry" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "birthDate" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "lastLogin" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ApplicationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Physiotherapist" (
    "applicationUserId" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "publicPhoneNumber" TEXT,

    CONSTRAINT "Physiotherapist_pkey" PRIMARY KEY ("applicationUserId")
);

-- CreateTable
CREATE TABLE "FinalUser" (
    "applicationUserId" TEXT NOT NULL,

    CONSTRAINT "FinalUser_pkey" PRIMARY KEY ("applicationUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_email_key" ON "ApplicationUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_username_key" ON "ApplicationUser"("username");

-- AddForeignKey
ALTER TABLE "Physiotherapist" ADD CONSTRAINT "Physiotherapist_applicationUserId_fkey" FOREIGN KEY ("applicationUserId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalUser" ADD CONSTRAINT "FinalUser_applicationUserId_fkey" FOREIGN KEY ("applicationUserId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
