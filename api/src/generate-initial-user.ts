import { Prisma, PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { bootstrap } from './bootstrap';
import { ConfigService } from '@nestjs/config';

async function generateInitialUser() {
  const app = await bootstrap();

  const prisma = new PrismaClient();
  prisma.$connect();

  const configService = app.get(ConfigService);

  const hashedPasswod = await argon2.hash(
    configService.get<string>('INITIAL_USER_PASSWORD'),
  );

  const user: Prisma.ApplicationUserCreateInput = {
    id: configService.get<string>('INITIAL_USER_ID'),
    email: configService.get<string>('INITIAL_USER_EMAIL'),
    passwordHash: hashedPasswod,
    firstName: 'Super',
    lastName: 'User',
    role: 'ADMIN',
    isEmailVerified: true,
    twoFactorEnabled: false,
  };

  await prisma.applicationUser.upsert({
    where: { id: user.id },
    create: { ...user },
    update: {},
  });
}

generateInitialUser();
