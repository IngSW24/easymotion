import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'superadmin@easymotion.it',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password',
  })
  // TODO: Change with NestJS Config
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;
}
