import { OmitType, PartialType } from '@nestjs/swagger';
import { CourseEntity } from '../entities/course.entity';

export class UpdateCoursesDto extends PartialType(
  OmitType(CourseEntity, ['created_at', 'updated_at', 'id']),
) {}
