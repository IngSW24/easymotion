-- AlterTable
ALTER TABLE "Physiotherapist" ALTER COLUMN "specialization" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CourseFinalUser" (
    "course_id" TEXT NOT NULL,
    "final_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CourseFinalUser_pkey" PRIMARY KEY ("course_id","final_user_id")
);

-- AddForeignKey
ALTER TABLE "CourseFinalUser" ADD CONSTRAINT "CourseFinalUser_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseFinalUser" ADD CONSTRAINT "CourseFinalUser_final_user_id_fkey" FOREIGN KEY ("final_user_id") REFERENCES "FinalUser"("applicationUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
