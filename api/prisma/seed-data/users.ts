import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { v4 } from 'uuid';

const getUsers = async (): Promise<Prisma.ApplicationUserCreateInput[]> => {
  const passwordHash = await argon2.hash('password');
  return [
    {
      id: v4(),
      email: 'admin@easymotion.it',
      passwordHash,
      username: 'admin',
      firstName: 'Admin',
      middleName: null,
      lastName: 'User',
      phoneNumber: '+393401234567',
      birthDate: '1990-05-15',
      role: 'ADMIN',
      isEmailVerified: true,
      lastLogin: '2025-01-08T10:00:00.000Z',
      failedLoginAttempts: 0,
    },
    {
      id: v4(),
      email: 'user@easymotion.it',
      passwordHash,
      username: 'customer',
      firstName: 'Customer',
      middleName: null,
      lastName: 'User',
      phoneNumber: '+393401234567',
      birthDate: '1990-05-15',
      role: 'USER',
      isEmailVerified: true,
      lastLogin: '2025-01-08T10:00:00.000Z',
      failedLoginAttempts: 0,
    },
    {
      id: v4(),
      email: 'physiotherapist@easymotion.it',
      passwordHash,
      username: 'physio',
      firstName: 'Physhiotherapist',
      middleName: null,
      lastName: 'User',
      phoneNumber: '+393401234567',
      birthDate: '1990-05-15',
      role: 'PHYSIOTHERAPIST',
      isEmailVerified: false,
      lastLogin: '2025-01-08T10:00:00.000Z',
      failedLoginAttempts: 0,
    },
  ];
};

export default getUsers;
