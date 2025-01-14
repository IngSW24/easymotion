import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class PasswordUpdateDto {
  @ApiProperty({
    name: 'userId',
    description: 'User ID of the user to reset the password',
  })
  @IsUUID()
  @Expose()
  userId: string;

  @ApiProperty({
    name: 'token',
    description: 'Token to reset the password',
  })
  @IsString()
  @Expose()
  token: string;

  @ApiProperty({
    name: 'newPassword',
    description: 'New password for the user',
  })
  // TODO use configuration
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  @Expose()
  newPassword: string;
}
