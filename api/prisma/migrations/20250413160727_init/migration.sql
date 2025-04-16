/*
  Warnings:

  - You are about to drop the column `is_free` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_payments` on the `Course` table. All the data in the column will be lost.
  - Added the required column `payment_recurrence` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `isPending` to the `CourseFinalUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentRecurrence" AS ENUM ('SINGLE', 'PER_SESSION', 'MONTHLY', 'ANNUAL');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "is_free",
DROP COLUMN "number_of_payments",
ADD COLUMN     "payment_recurrence" "PaymentRecurrence" NOT NULL,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "CourseFinalUser" ADD COLUMN     "isPending" BOOLEAN NOT NULL;
