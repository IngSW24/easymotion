import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

const getUsers = async (): Promise<Prisma.ApplicationUserCreateInput[]> => {
  const passwordHash = await argon2.hash('password');
  return [
    {
      id: '1a2b3c4d-5678-9abc-def0-123456789abc',
      email: 'superadmin@easymotion.it',
      passwordHash,
      username: 'superadmin',
      firstName: 'Super',
      middleName: null,
      lastName: 'Admin',
      phoneNumber: '+393401234567',
      birthDate: '1990-05-15',
      role: 'USER',
      isEmailVerified: true,
      lastLogin: '2025-01-08T10:00:00.000Z',
      failedLoginAttempts: 0,
    },
    {
      id: '5f6g7h8i-9j0k-lmno-pqr1-2s3t4u5v6w7x',
      email: 'superadmin2@easymotion.it',
      passwordHash,
      username: 'superadmin2',
      firstName: 'Super',
      middleName: '2',
      lastName: 'Admin',
      phoneNumber: '+393401234567',
      birthDate: '1990-05-15',
      role: 'USER',
      isEmailVerified: false,
      lastLogin: '2025-01-08T10:00:00.000Z',
      failedLoginAttempts: 0,
    },
  ];
};

export default getUsers;
