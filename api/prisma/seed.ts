import { PrismaClient } from "@prisma/client";
import getUsers from "./seed-data/users";
import getCourses from "./seed-data/courses";
import { getCategories } from "./seed-data/categories";

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
        await tx.patient.upsert({
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

  const categories = getCategories();

  for (const category of categories) {
    await prisma.courseCategory.upsert({
      where: { id: category.id },
      update: {},
      create: { ...category },
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
