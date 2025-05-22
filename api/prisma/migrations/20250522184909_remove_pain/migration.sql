/*
  Warnings:

  - You are about to drop the column `painCharacteristics` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `painFrequency` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `painIntensity` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `painModifiers` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `painZone` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `perceivedStress` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "painCharacteristics",
DROP COLUMN "painFrequency",
DROP COLUMN "painIntensity",
DROP COLUMN "painModifiers",
DROP COLUMN "painZone",
DROP COLUMN "perceivedStress";
