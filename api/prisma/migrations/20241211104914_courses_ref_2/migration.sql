/*
  Warnings:

  - Changed the type of `type` on the `Course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('AUTONOMOUS', 'INDIVIDUAL', 'GROUP');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "type",
ADD COLUMN     "type" "CourseType" NOT NULL;

-- DropEnum
DROP TYPE "EventType";
