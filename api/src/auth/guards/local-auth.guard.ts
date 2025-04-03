import { AuthGuard } from "@nestjs/passport";
import { AdminLocalStrategyName, UserLocalStrategyName } from "../constants";

export class AdminLocalAuthGuard extends AuthGuard(AdminLocalStrategyName) {}
export class UserLocalAuthGuard extends AuthGuard(UserLocalStrategyName) {}
