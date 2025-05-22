import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";
import CheckPasswordConstraints from "src/auth/decorators/strong-password.decorator";

export class SignUpDto {
  @ApiProperty({
    description: "Email address of the new user",
    example: "john.doe@example.com",
  })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    description: "Password of the user",
    example: "password",
  })
  @CheckPasswordConstraints()
  @Expose()
  password: string;

  @ApiProperty({
    description: "Repeated password of the user",
    example: "password",
  })
  @IsString()
  @Expose()
  repeatedPassword: string;

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
  @IsDate()
  @Type(() => Date)
  @Expose()
  birthDate?: string;
}
