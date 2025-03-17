import { PrismaClient } from "@prisma/client";
import courses from "./seed-data/courses";
import getUsers from "./seed-data/users";

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
      })
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
