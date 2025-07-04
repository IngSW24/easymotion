import { Prisma, Sex } from "@prisma/client";
import * as argon2 from "argon2";

const getUsers = async (): Promise<Prisma.UserCreateInput[]> => {
  const passwordHash = await argon2.hash("password1234");
  return [
    {
      id: "f44cb306-cfdd-488b-bd4f-6ac9b14b3ddf",
      email: "admin@easymotion.it",
      passwordHash,
      firstName: "Admin",
      middleName: null,
      lastName: "User",
      phoneNumber: "+393401234567",
      birthDate: "1990-05-15",
      role: "ADMIN",
      isEmailVerified: true,
      lastLogin: "2025-01-08T10:00:00.000Z",
      failedLoginAttempts: 0,
    },
    {
      id: "64d007c8-1853-4a1f-8c1c-993719ab857f",
      email: "user@easymotion.it",
      passwordHash,
      firstName: "Customer",
      middleName: null,
      lastName: "User",
      phoneNumber: "+393401234567",
      birthDate: "1990-05-15",
      role: "USER",
      isEmailVerified: true,
      lastLogin: "2025-01-08T10:00:00.000Z",
      failedLoginAttempts: 0,
      patient: {
        create: { sex: Sex.FEMALE },
      },
    },
    {
      id: "24d007c8-1853-4a1f-8c1c-993719ab857f",
      email: "user2@easymotion.it",
      passwordHash,
      firstName: "Customer2",
      middleName: null,
      lastName: "User2",
      phoneNumber: "+393401234567",
      birthDate: "1990-05-15",
      role: "USER",
      isEmailVerified: true,
      lastLogin: "2025-01-08T10:00:00.000Z",
      failedLoginAttempts: 0,
      patient: {
        create: { sport: "BICI" },
      },
    },
    {
      id: "ced013b7-9931-4499-ba6b-64274a1700f6",
      email: "physiotherapist@easymotion.it",
      passwordHash,
      firstName: "Physhiotherapist",
      middleName: null,
      lastName: "User",
      phoneNumber: "+393401234567",
      birthDate: "1990-05-15",
      role: "PHYSIOTHERAPIST",
      isEmailVerified: true,
      lastLogin: "2025-01-08T10:00:00.000Z",
      failedLoginAttempts: 0,
      physiotherapist: {
        create: {
          specialization: "Sports Rehabilitation",
          publicPhoneNumber: "+393401234567",
        },
      },
    },
  ];
};

export default getUsers;
