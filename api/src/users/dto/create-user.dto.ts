import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  Length,
  IsBoolean,
} from "class-validator";
import { Role } from "@prisma/client";
import { Expose } from "class-transformer";

export class CreateUserDto {
  @ApiProperty({
    description: "Email address of the new user",
    example: "john.doe@example.com",
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    description: "Plain-text password for the new user (will be hashed)",
    example: "MyStrongP@ssw0rd!",
    minLength: 6,
  })
  @IsString()
  @Length(6)
  @Expose()
  password: string;

  @ApiProperty({
    description: "Flag indicating if the email address has been verified",
    example: true,
  })
  @IsBoolean()
  @Expose()
  isEmailVerified: boolean;

  @ApiProperty({
    description: "First name of the new user",
    example: "John",
  })
  @IsString()
  @Expose()
  firstName: string;

  @ApiPropertyOptional({
    description: "Middle name of the new user (optional)",
    example: "Alexander",
  })
  @IsOptional()
  @IsString()
  @Expose()
  middleName?: string;

  @ApiProperty({
    description: "Last name of the new user",
    example: "Doe",
  })
  @IsString()
  @Expose()
  lastName: string;

  @ApiPropertyOptional({
    description: "Phone number of the new user (optional)",
    example: "+123456789",
  })
  @IsOptional()
  @IsString()
  @Expose()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: "Birth date in ISO format (YYYY-MM-DD) (optional)",
    example: "1990-01-01",
  })
  @IsOptional()
  @IsDateString()
  @Expose()
  birthDate?: string;

  @ApiPropertyOptional({
    description: "Role of the new user (defaults to USER if not provided)",
    enum: Role,
    default: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role)
  @Expose()
  role?: Role;
}
