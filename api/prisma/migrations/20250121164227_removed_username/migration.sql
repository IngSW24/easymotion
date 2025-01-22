/*
  Warnings:

  - You are about to drop the column `username` on the `ApplicationUser` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ApplicationUser_username_key";

-- AlterTable
ALTER TABLE "ApplicationUser" DROP COLUMN "username";
