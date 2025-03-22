import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import { AuthFlowHeaderName, WebAuthFlowName } from "src/auth/constants";
import { CustomRequest } from "src/common/types/custom-request";

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    req.isWebAuth = req.headers[AuthFlowHeaderName] === WebAuthFlowName;
    next();
  }
}
