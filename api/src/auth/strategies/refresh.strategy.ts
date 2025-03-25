import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import { Inject } from "@nestjs/common";
import jwtConfig from "src/config/jwt.config";
import { AuthFlowHeaderName, RefreshStrategyName } from "../constants";

export class RefreshStrategy extends PassportStrategy(
  Strategy,
  RefreshStrategyName
) {
  constructor(
    @Inject(jwtConfig.KEY)
    config: ConfigType<typeof jwtConfig>
  ) {
    super({
      jwtFromRequest: (req) => {
        if (!req) return null;

        // If it's a web request, the refresh token is in the cookie
        if (req.headers[AuthFlowHeaderName] === "web" && req.cookies) {
          return req.cookies["refreshToken"];
        }

        // Otherwise, the refresh token is in the body
        return req?.body?.refreshToken ?? null;
      },
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
