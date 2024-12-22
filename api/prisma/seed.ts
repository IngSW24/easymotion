import { PrismaClient } from '@prisma/client';
import { CourseEntity } from 'src/courses/entities/course.entity';

const prisma = new PrismaClient();

async function main() {
  const data = require('./seed_data.json');
  console.log(data);

  await data.courses.forEach(async (e: CourseEntity) => {
    await prisma.course.upsert({
      where: { id: e.id },
      update: {},
      create: {
        name: e.name,
        description: e.description,
        short_description: e.short_description,
        location: e.location || null,
        instructors: e.instructors,
        category: e.category,
        level: e.level,
        frequency: e.frequency,
        session_duration: e.session_duration,
        schedule: e.schedule,
        cost: e.cost || null,
        discount: e.discount || null,
        availability: e.availability,
        highlighted_priority: e.highlighted_priority || null,
        members_capacity: e.members_capacity || null,
        num_registered_members: e.num_registered_members || null,
        tags: e.tags,
        thumbnail_path: e.thumbnail_path || null,
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
