import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "./roles.decorator";
import { JwtGuard } from "../guards/jwt.guard";
import { RolesGuard } from "../guards/roles.guard";

export default function UseAuth(roles?: string | string[] | undefined): any {
  if (!roles) {
    return applyDecorators(ApiBearerAuth(), UseGuards(JwtGuard));
  }

  const roleList =
    typeof roles === "string"
      ? roles.split(",").map((role) => role.trim().toLowerCase())
      : roles.map((x) => x.toLowerCase());

  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(roleList)
  );
}
