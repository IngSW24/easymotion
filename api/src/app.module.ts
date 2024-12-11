import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/courses.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [ConfigModule.forRoot(), CourseModule, PrismaModule],
})
export class AppModule {}
