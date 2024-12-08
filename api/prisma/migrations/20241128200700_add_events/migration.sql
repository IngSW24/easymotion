-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('AUTONOMOUS', 'INDIVIDUAL', 'GROUP');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "frequency" TEXT,
    "times" TEXT,
    "cost" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
