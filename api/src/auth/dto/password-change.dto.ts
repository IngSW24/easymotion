import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsStrongPassword } from 'class-validator';

export class PasswordChangeDto {
  @ApiProperty({
    name: 'old',
    description: 'The previous password',
  })
  @Expose()
  oldPassword: string;

  @ApiProperty({
    name: 'newPassword',
    description: 'The new password',
  })
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
