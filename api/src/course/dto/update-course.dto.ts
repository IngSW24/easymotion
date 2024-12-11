import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { CourseEntity } from '../entities/course.entity';
import { Decimal } from '@prisma/client/runtime/library';

export class UpdateCoursesDto extends PartialType(CourseEntity) {}
