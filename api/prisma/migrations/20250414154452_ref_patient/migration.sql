/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `final_user_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `FinalUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `patient_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FinalUser" DROP CONSTRAINT "FinalUser_applicationUserId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_final_user_id_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "final_user_id",
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("course_id", "patient_id");

-- DropTable
DROP TABLE "FinalUser";

-- CreateTable
CREATE TABLE "Patient" (
    "applicationUserId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("applicationUserId")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("applicationUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_applicationUserId_fkey" FOREIGN KEY ("applicationUserId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
