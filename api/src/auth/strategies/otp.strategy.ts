import { Strategy } from "passport-custom";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { OtpLoginDto } from "../dto/actions/otp-login.dto";
import { plainToInstance } from "class-transformer";
import { OtpStrategyName } from "../constants";

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, OtpStrategyName) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const { email, otp } = plainToInstance(OtpLoginDto, req.body);

    if (!email || !otp) {
      throw new UnauthorizedException("Missing email or OTP");
    }

    const user = await this.authService.validateOtp({ email, otp });

    if (!user) {
      throw new UnauthorizedException("Invalid OTP");
    }

    return user;
  }
}
