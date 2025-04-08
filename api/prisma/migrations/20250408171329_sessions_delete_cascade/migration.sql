-- DropForeignKey
ALTER TABLE "CourseSession" DROP CONSTRAINT "CourseSession_course_id_fkey";

-- AddForeignKey
ALTER TABLE "CourseSession" ADD CONSTRAINT "CourseSession_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
