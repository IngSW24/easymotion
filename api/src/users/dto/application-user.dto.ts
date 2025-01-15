import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsBoolean,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApplicationUser, Role } from '@prisma/client';

export class ApplicationUserDto implements Readonly<ApplicationUser> {
  @ApiProperty({
    description: 'Unique user identifier (UUID)',
    example: 'b3bf4d18-8dd0-43a1-b1da-fd3f7b9553a1',
  })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Unique username for the user',
    example: 'john_doe',
  })
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @Expose()
  firstName: string;

  @ApiPropertyOptional({
    description: 'User middle name',
    example: 'Alexander',
  })
  @IsString()
  @IsOptional()
  @Expose()
  middleName: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @Expose()
  lastName: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  @Expose()
  phoneNumber: string | null;

  @ApiPropertyOptional({
    description: 'User birth date',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsString()
  @Expose()
  birthDate: string | null;

  @ApiProperty({
    description: 'User role in the system',
    enum: Role,
    default: Role.USER,
  })
  @IsEnum(Role)
  @Expose()
  role: Role;

  @ApiProperty({
    description: 'Indicates if the user email has been verified',
    default: false,
    example: false,
  })
  @IsBoolean()
  @Expose()
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'Timestamp of the user last login',
    example: '2025-12-31T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsDate()
  @Expose()
  lastLogin: Date;

  @ApiProperty({
    description: 'Timestamp of when the user was created',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of the user last update',
    example: '2025-01-10T10:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  @Expose()
  updatedAt: Date;

  @ApiHideProperty()
  emailConfirmationToken: string;

  @ApiHideProperty()
  emailConfirmationTokenExpiry: Date;

  @ApiHideProperty()
  passwordHash: string;

  @ApiHideProperty()
  passwordResetToken: string;

  @ApiHideProperty()
  passwordResetTokenExpiry: Date;

  @ApiHideProperty()
  twoFactorCode: string;

  @ApiHideProperty()
  twoFactorExpiry: Date;

  @ApiHideProperty()
  twoFactorEnabled: boolean;

  @ApiHideProperty()
  failedLoginAttempts: number;

  constructor(partial: Partial<ApplicationUserDto>) {
    Object.assign(this, partial);
  }
}
