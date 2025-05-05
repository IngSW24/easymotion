/*
  Warnings:

  - You are about to drop the `CourseFinalUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseFinalUser" DROP CONSTRAINT "CourseFinalUser_course_id_fkey";

-- DropForeignKey
ALTER TABLE "CourseFinalUser" DROP CONSTRAINT "CourseFinalUser_final_user_id_fkey";

-- DropTable
DROP TABLE "CourseFinalUser";

-- CreateTable
CREATE TABLE "Subscription" (
    "course_id" TEXT NOT NULL,
    "final_user_id" TEXT NOT NULL,
    "isPending" BOOLEAN NOT NULL,
    "subscriptionRequestMessage" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("course_id","final_user_id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_final_user_id_fkey" FOREIGN KEY ("final_user_id") REFERENCES "FinalUser"("applicationUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
