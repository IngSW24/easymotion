import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApplicationUserDto } from 'src/users/dto/application-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

export const createUserDtoMock = (): CreateUserDto => ({
  email: 'test@example.com',
  password: 'securepassword123',
  firstName: 'testname',
  lastName: 'lastname',
  middleName: 'middlename',
  birthDate: '01-01-1999',
  phoneNumber: '0000000000',
  role: 'USER',
});

export const updateUserDtoMock = (): UpdateUserDto => ({
  email: 'newemail@example.com',
  firstName: 'newname',
  lastName: 'newlastname',
});

export const mappedUserPlainToInstanceMock = () => ({
  id: undefined,
  email: 'test@example.com',
  firstName: 'testname',
  middleName: 'middlename',
  lastName: 'lastname',
  phoneNumber: '0000000000',
  birthDate: '01-01-1999',
  role: 'USER',
  isEmailVerified: undefined,
  lastLogin: undefined,
  createdAt: undefined,
  updatedAt: undefined,
});

export const applicationUserDtoMock = (): ApplicationUserDto => ({
  id: '2aa48862-4f03-409d-b0db-499de5715b26',
  email: 'test@example.com',
  passwordHash: 'securepassword123',
  firstName: 'testname',
  lastName: 'lastname',
  middleName: 'middlename',
  birthDate: '01-01-1999',
  phoneNumber: '0000000000',
  role: 'USER',
  isEmailVerified: false,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  emailConfirmationToken: 'emailConfirmationToken',
  emailConfirmationTokenExpiry: new Date(),
  passwordResetToken: 'passwordResetToken',
  passwordResetTokenExpiry: new Date(),
  twoFactorCode: 'twoFactorCode',
  twoFactorExpiry: new Date(),
  twoFactorEnabled: false,
  failedLoginAttempts: 0,
});

export const applicationUsersList = () => [
  {
    id: '27b10d39-b26f-4786-874b-ee53556e6bdd',
    email: 'user1@example.com',
  },
  {
    id: '58dbaf7f-ab07-4e77-a77d-c47851ba1be7',
    email: 'user2@example.com',
  },
];
