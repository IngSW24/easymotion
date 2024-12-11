import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, PrismaService],
})
export class CourseModule {}
