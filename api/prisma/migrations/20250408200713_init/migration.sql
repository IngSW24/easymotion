/*
  Warnings:

  - Added the required column `subscription_end_date` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "subscription_end_date" TIMESTAMPTZ(3) NOT NULL,
ADD COLUMN     "subscription_start_date" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
