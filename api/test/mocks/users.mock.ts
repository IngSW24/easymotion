import { ActivityLevel, MobilityLevel } from "@prisma/client";
import { UserDto } from "src/users/dto/user/user.dto";
import { CreateUserDto } from "src/users/dto/user/create-user.dto";
import { UpdateUserDto } from "src/users/dto/user/update.user.dto";

export const createUserDtoMock = (): CreateUserDto => ({
  email: "test@example.com",
  password: "securepassword123",
  isEmailVerified: false,
  firstName: "testname",
  lastName: "lastname",
  middleName: "middlename",
  birthDate: "01-01-1999",
  phoneNumber: "0000000000",
  role: "USER",
});

export const updateUserDtoMock = (): UpdateUserDto => ({
  email: "newemail@example.com",
  firstName: "newname",
  lastName: "newlastname",
});

export const mappedUserPlainToInstanceMock = () => ({
  id: undefined,
  email: "test@example.com",
  firstName: "testname",
  middleName: "middlename",
  lastName: "lastname",
  phoneNumber: "0000000000",
  birthDate: "01-01-1999",
  role: "USER",
  isEmailVerified: false,
  twoFactorEnabled: undefined,
  lastLogin: undefined,
  createdAt: undefined,
  updatedAt: undefined,
});

export const userDtoMock = (): UserDto => ({
  id: "2aa48862-4f03-409d-b0db-499de5715b26",
  email: "test@example.com",
  passwordHash: "securepassword123",
  firstName: "testname",
  lastName: "lastname",
  middleName: "middlename",
  birthDate: "01-01-1999",
  phoneNumber: "0000000000",
  role: "USER",
  isEmailVerified: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  emailConfirmationToken: "emailConfirmationToken",
  emailConfirmationTokenExpiry: new Date(),
  passwordResetToken: "passwordResetToken",
  passwordResetTokenExpiry: new Date(),
  twoFactorCode: "twoFactorCode",
  twoFactorExpiry: new Date(),
  twoFactorEnabled: false,
  failedLoginAttempts: 0,
  picturePath: "",
  physiotherapist: {
    bio: "Physiotherapist 1",
    specialization: "",
    publicPhoneNumber: "",
    publicEmail: "",
    publicAddress: "",
    website: "",
    socialMediaLinks: [],
    userId: "",
  },
  patient: {
    sex: "MALE",
    height: 170,
    weight: 70,
    smoker: false,
    activityLevel: ActivityLevel.MEDIUM,
    mobilityLevel: MobilityLevel.LIMITED,
    restingHeartRate: 70,
    bloodPressure: "120/80",
    lastMedicalCheckup: new Date(),
    notes: "Notes",
    userId: "",
    alcoholUnits: 0,
    profession: "",
    sport: "",
    sportFrequency: 0,
    medications: "",
    allergies: "",
    otherPathologies: "",
    painZone: "",
    painIntensity: 0,
    painFrequency: "CONSTANT",
    painCharacteristics: "",
    painModifiers: "",
    sleepHours: 8,
    perceivedStress: 0,
    personalGoals: "",
  },
});

export const usersList = () => [
  {
    id: "27b10d39-b26f-4786-874b-ee53556e6bdd",
    email: "user1@example.com",
  },
  {
    id: "58dbaf7f-ab07-4e77-a77d-c47851ba1be7",
    email: "user2@example.com",
  },
];
