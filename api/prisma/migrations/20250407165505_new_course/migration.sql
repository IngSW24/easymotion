/*
  Warnings:

  - You are about to drop the column `availability` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `highlighted_priority` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `members_capacity` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `num_registered_members` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `schedule` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `session_duration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_path` on the `Course` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_free` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_published` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptions_open` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "availability",
DROP COLUMN "category",
DROP COLUMN "cost",
DROP COLUMN "discount",
DROP COLUMN "frequency",
DROP COLUMN "highlighted_priority",
DROP COLUMN "members_capacity",
DROP COLUMN "num_registered_members",
DROP COLUMN "schedule",
DROP COLUMN "session_duration",
DROP COLUMN "thumbnail_path",
ADD COLUMN     "category_id" TEXT NOT NULL,
ADD COLUMN     "is_free" BOOLEAN NOT NULL,
ADD COLUMN     "is_published" BOOLEAN NOT NULL,
ADD COLUMN     "max_subscribers" INTEGER,
ADD COLUMN     "number_of_payments" INTEGER,
ADD COLUMN     "price" DECIMAL(65,30),
ADD COLUMN     "subscriptions_open" BOOLEAN NOT NULL;

-- DropEnum
DROP TYPE "CourseAvailability";

-- DropEnum
DROP TYPE "CourseCategory";

-- DropEnum
DROP TYPE "CourseFrequency";

-- CreateTable
CREATE TABLE "CourseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSession" (
    "id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CourseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
