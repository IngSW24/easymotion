import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RefreshStrategyName } from "../constants";

@Injectable()
export class RefreshGuard extends AuthGuard(RefreshStrategyName) {}
