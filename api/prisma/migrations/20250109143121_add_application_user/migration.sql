-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'PHYSIOTHERAPIST');

-- CreateTable
CREATE TABLE "ApplicationUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "birthDate" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ApplicationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Physiotherapist" (
    "id" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "publicPhoneNumber" TEXT,

    CONSTRAINT "Physiotherapist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalUser" (
    "id" TEXT NOT NULL,

    CONSTRAINT "FinalUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_email_key" ON "ApplicationUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_username_key" ON "ApplicationUser"("username");

-- AddForeignKey
ALTER TABLE "Physiotherapist" ADD CONSTRAINT "Physiotherapist_id_fkey" FOREIGN KEY ("id") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalUser" ADD CONSTRAINT "FinalUser_id_fkey" FOREIGN KEY ("id") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
