import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  Length,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the new user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Plain-text password for the new user (will be hashed)',
    example: 'MyStrongP@ssw0rd!',
    minLength: 6,
  })
  @IsString()
  @Length(6)
  password: string;

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

  @ApiPropertyOptional({
    description: 'Role of the new user (defaults to USER if not provided)',
    enum: Role,
    default: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
