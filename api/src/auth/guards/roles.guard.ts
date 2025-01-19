import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { AuthUserDto } from '../dto/auth-user/auth-user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private hasRole(user: AuthUserDto, roles: string[]): boolean {
    return roles.some((role) => role.toLowerCase() === user.role.toLowerCase());
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role && this.hasRole(user, roles);
  }
}
