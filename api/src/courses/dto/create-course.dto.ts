import { OmitType } from '@nestjs/swagger';
import { CourseEntity } from './course.dto';

export class CreateCourseDto extends OmitType(CourseEntity, [
  'id',
  'created_at',
  'updated_at',
]) {}
