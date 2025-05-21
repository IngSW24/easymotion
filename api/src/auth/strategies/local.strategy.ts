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
    try {
      const user = await this.authService.validateUser(email, password, [
        Role.PHYSIOTHERAPIST,
        Role.USER,
      ]);

      if (!user) {
        throw new UnauthorizedException();
      }

      if (user.twoFactorEnabled) {
        await this.authService.sendOtpCode(user.id, user.email);
        return { requiresOtp: true };
      }

      return user;
    } catch (e) {
      throw new UnauthorizedException(e); // TODO: remove error message in production
    }
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
    const user = await this.authService.validateUser(email, password, [
      Role.ADMIN,
    ]);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.twoFactorEnabled) {
      await this.authService.sendOtpCode(user.id, user.email);
      return { requiresOtp: true };
    }

    return user;
  }
}
