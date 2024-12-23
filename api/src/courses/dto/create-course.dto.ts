import { OmitType } from '@nestjs/swagger';
import { CourseEntity } from '../entities/course.entity';

export class CreateCourseDto extends OmitType(CourseEntity, [
  'id',
  'created_at',
  'updated_at',
]) {}
