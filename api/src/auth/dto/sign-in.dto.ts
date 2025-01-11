import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'superadmin@easymotion.it',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Hashed password (using Aragon2i) in Encoded Form',
    example: '$argon2i$v=19$m=16,t=2,p=1$cGFzc3dvcmQ$A9HKT/FCm9ft8VCFgT4rVw',
  })
  @Exclude()
  passwordHash: string;
}
