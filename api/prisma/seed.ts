import { PrismaClient } from '@prisma/client';
import { create } from 'domain';
import { last } from 'rxjs';
import { CourseEntity } from 'src/courses/entities/course.entity';

const prisma = new PrismaClient();

async function main() {
  const data = require('./seed_data.json');
  console.log(data);

  for (const e of data.courses) {
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
  }

  for (const e of data.applicationUsers) {
    await prisma.applicationUser.upsert({
      where: { id: e.id },
      update: {},
      create: {
        email: e.email,
        password: e.password,
        username: e.username,
        firstName: e.firstName,
        middleName: e.middleName || null,
        lastName: e.lastName,
        phoneNumber: e.phoneNumber || null,
        birthDate: e.birthDate || null,
        role: e.role,
        isEmailVerified: e.isEmailVerified,
        lastLogin: e.lastLogin || null,
        failedLoginAttempts: e.failedLoginAttempts,
      },
    });
  }

  for (const e of data.physiotherapists) {
    console.log(e);
    await prisma.physiotherapist.upsert({
      where: { id: e.id },
      update: {},
      create: {
        specialization: e.specialization,
        publicPhoneNumber: e.publicPhoneNumber,
      },
    });
  }

  for (const e of data.finalUsers) {
    await prisma.finalUser.upsert({
      where: { id: e.id },
      update: {},
      create: {},
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
