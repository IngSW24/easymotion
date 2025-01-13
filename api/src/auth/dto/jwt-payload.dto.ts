import { AuthUserDto } from './auth-user.dto';

export class JwtPayloadDto {
  sub: string;
  username: string;
  email: string;
  role: string;

  constructor(partial: Partial<JwtPayloadDto>) {
    Object.assign(this, partial);
  }

  static fromObject(jwtPayload: any): JwtPayloadDto {
    return new JwtPayloadDto(jwtPayload);
  }

  static fromUser(authUserDto: AuthUserDto): JwtPayloadDto {
    return new JwtPayloadDto({
      sub: authUserDto.id,
      username: authUserDto.username,
      email: authUserDto.email,
      role: authUserDto.role,
    });
  }

  toObject() {
    return {
      sub: this.sub,
      username: this.username,
      email: this.email,
      role: this.role,
    };
  }
}
