import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // TODO: Retrieve the user roles from DB to make sure it's up to date with the changes after last login
    const req = context.switchToHttp().getRequest();
    const userRoles = req.user.user.roles || [];
    const isGlobalManager =
      userRoles.filter((el) => el.role === Role.GlobalManager).length !== 0;

    if (!userRoles.length && !isGlobalManager) return false;

    req.user.isGlobalManager = isGlobalManager;
    req.user.managedGroups = isGlobalManager
      ? []
      : userRoles
          .filter((el) => el.role === Role.Manager)
          .map((el) => el.groupid);

    return true;
  }
}
