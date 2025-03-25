import { PrismaClient } from "@prisma/client";
import getUsers from "./seed-data/users";
import getCourses from "./seed-data/courses";

const prisma = new PrismaClient();

async function main() {
  const users = await getUsers();

  for (const e of users) {
    await prisma.$transaction(async (tx) => {
      await tx.applicationUser.upsert({
        where: { id: e.id },
        update: {},
        create: { ...e },
      });

      if (e.role === "USER") {
        await tx.finalUser.upsert({
          where: { applicationUserId: e.id },
          update: {},
          create: {
            applicationUserId: e.id,
          },
        });
      }

      if (e.role === "PHYSIOTHERAPIST") {
        await tx.physiotherapist.upsert({
          where: { applicationUserId: e.id },
          update: {},
          create: {
            applicationUserId: e.id,
          },
        });
      }
    });
  }

  const courses = await getCourses();

  for (const e of courses) {
    await prisma.course.upsert({
      where: { id: e.id },
      update: {},
      create: { ...e },
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
