import { PrismaClient } from '@prisma/client';
import courses from './seed-data/courses';
import getUsers from './seed-data/users';

const prisma = new PrismaClient();

async function main() {
  for (const e of courses) {
    await prisma.course.upsert({
      where: { id: e.id },
      update: {},
      create: { ...e },
    });
  }

  (await getUsers()).forEach(
    async (e) =>
      await prisma.applicationUser.upsert({
        where: { id: e.id },
        update: {},
        create: { ...e },
      }),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
