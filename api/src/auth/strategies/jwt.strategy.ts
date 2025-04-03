import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import { Inject } from "@nestjs/common";
import jwtConfig from "src/config/jwt.config";
import { JwtStrategyName } from "../constants";

export class JwtStrategy extends PassportStrategy(Strategy, JwtStrategyName) {
  constructor(
    @Inject(jwtConfig.KEY)
    config: ConfigType<typeof jwtConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
