import { AuthGuard } from "@nestjs/passport";
import { OtpStrategyName } from "../constants";

export class OtpGuard extends AuthGuard(OtpStrategyName) {}
