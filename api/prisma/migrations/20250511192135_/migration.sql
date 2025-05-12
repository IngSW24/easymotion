/*
  Warnings:

  - You are about to drop the column `heightCm` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `weightKg` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "heightCm",
DROP COLUMN "weightKg",
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION;
