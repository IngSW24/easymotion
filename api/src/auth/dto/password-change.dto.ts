import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsStrongPassword } from 'class-validator';

export class PasswordChangeDto {
  @ApiProperty({
    description: 'The previous password',
  })
  @IsString()
  @Expose()
  oldPassword: string;

  @ApiProperty({
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
