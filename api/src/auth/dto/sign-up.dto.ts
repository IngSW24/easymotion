import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Email address of the new user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @Expose()
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
  @Expose()
  password: string;

  @ApiProperty({
    description: 'Repeated password of the user',
    example: 'password',
  })
  @IsString()
  @Expose()
  repeatedPassword: string;

  @ApiProperty({
    description: 'Unique username for the new user',
    example: 'john_doe',
  })
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({
    description: 'First name of the new user',
    example: 'John',
  })
  @IsString()
  @Expose()
  firstName: string;

  @ApiPropertyOptional({
    description: 'Middle name of the new user (optional)',
    example: 'Alexander',
  })
  @IsOptional()
  @IsString()
  @Expose()
  middleName?: string;

  @ApiProperty({
    description: 'Last name of the new user',
    example: 'Doe',
  })
  @IsString()
  @Expose()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Phone number of the new user (optional)',
    example: '+123456789',
  })
  @IsOptional()
  @IsString()
  @Expose()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Birth date in ISO format (YYYY-MM-DD) (optional)',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  @Expose()
  birthDate?: string;
}
