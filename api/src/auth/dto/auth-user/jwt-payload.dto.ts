import { BaseAuthUserDto } from "./auth-user.dto";

export class JwtPayloadDto {
  sub: string;
  email: string;
  role: string;

  static fromUser(authUserDto: BaseAuthUserDto): JwtPayloadDto {
    return {
      sub: authUserDto.id,
      email: authUserDto.email,
      role: authUserDto.role,
    };
  }
}
