import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiProperty({
    description: 'Repeated password of the user',
    example: 'password',
  })
  @IsString()
  repeatedPassword: string;

  @ApiProperty({
    description: 'Unique username for the new user',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'First name of the new user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({
    description: 'Middle name of the new user (optional)',
    example: 'Alexander',
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    description: 'Last name of the new user',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Phone number of the new user (optional)',
    example: '+123456789',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Birth date in ISO format (YYYY-MM-DD) (optional)',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
