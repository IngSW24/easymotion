import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const data = require('./seed_data.json');
  console.log(data);

  await data.courses.forEach(async (e) => {
    await prisma.course.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id: e.id,
        organizer: e.organizer,
        instructor: e.instructor,
        type: e.type,
        description: e.description,
        location: e.location,
        frequency: e.frequency,
        times: e.times,
        cost: e.cost,
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
