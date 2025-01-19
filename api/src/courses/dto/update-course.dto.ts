import { OmitType, PartialType } from '@nestjs/swagger';
import { CourseEntity } from './course.dto';

export class UpdateCoursesDto extends PartialType(
  OmitType(CourseEntity, ['created_at', 'updated_at', 'id']),
) {}
