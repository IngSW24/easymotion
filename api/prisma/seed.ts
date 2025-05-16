import { PrismaClient } from "@prisma/client";
import getUsers from "./seed-data/users";
import getCourses from "./seed-data/courses";
import { getCategories } from "./seed-data/categories";
import { getSubscriptions } from "./seed-data/subscriptions";

const prisma = new PrismaClient();

async function main() {
  const users = await getUsers();

  for (const e of users) {
    await prisma.$transaction(async (tx) => {
      await tx.applicationUser.upsert({
        where: { id: e.id },
        update: {},
        create: { ...e },
      }); // this will create the patient/physio in according to the seed, see seed-data/users.ts
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

  const subscriptions = getSubscriptions();

  for (const e of subscriptions) {
    await prisma.subscription.upsert({
      where: {
        course_id_patient_id: {
          course_id: e.course_id,
          patient_id: e.patient_id,
        },
      },
      update: {},
      create: { ...e },
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
