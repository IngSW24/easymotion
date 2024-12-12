/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Event";

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "frequency" TEXT,
    "times" TEXT,
    "cost" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
