import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AdminLocalStrategyName, UserLocalStrategyName } from "../constants";
import { Role } from "@prisma/client";

@Injectable()
export class UserLocalStrategy extends PassportStrategy(
  Strategy,
  UserLocalStrategyName
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string) {
    const user = this.authService.validateUser(email, password, [
      Role.PHYSIOTHERAPIST,
      Role.USER,
    ]);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  AdminLocalStrategyName
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  async validate(email: string, password: string) {
    const user = this.authService.validateUser(email, password, [Role.ADMIN]);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
