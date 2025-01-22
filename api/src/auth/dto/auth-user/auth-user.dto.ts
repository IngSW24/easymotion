import { PickType } from '@nestjs/swagger';
import { ApplicationUserDto } from 'src/users/dto/application-user.dto';

export class AuthUserDto extends PickType(ApplicationUserDto, [
  'id',
  'birthDate',
  'email',
  'firstName',
  'middleName',
  'lastName',
  'phoneNumber',
  'role',
  'isEmailVerified',
  'twoFactorEnabled',
] as const) {}
