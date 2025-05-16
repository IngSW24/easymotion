import { Module } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { PrismaService } from "nestjs-prisma";
import { AssetsModule } from "src/assets/assets.module";
import { EmailModule } from "src/email/email.module";

@Module({
  imports: [AssetsModule, EmailModule],
  controllers: [CoursesController],
  providers: [CoursesService, PrismaService],
  exports: [CoursesService],
})
export class CourseModule {}
