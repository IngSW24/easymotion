/*
  Warnings:

  - Added the required column `owner_id` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Physiotherapist"("applicationUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
