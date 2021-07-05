import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/auth/role.enum';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    req.user.isGlobalManager = isGlobalManager;
    const managedGroups = (req.user.managedGroups = isGlobalManager
      ? []
      : userRoles
          .filter((el) => el.role === Role.Manager)
          .map((el) => el.group.id));
    const isRegularUser = (req.user.isRegularUser =
      !req.user.managedGroups.length && !isGlobalManager);

    const className = context.getClass().name.replace('Controller', ''); // "CatsController"
    const methodName = context.getHandler().name; // "create"
    const requestId = req.params.id;
    switch (className) {
      case 'Users':
        switch (methodName) {
          case 'create':
            if (!isGlobalManager && managedGroups.length === 0) return false;
            return true;

          case 'deleteOne':
          case 'update':
            const userToBeUpdated: User = await this.usersService.findOne(
              requestId,
            );

            if (!userToBeUpdated) return false;

            return (
              isGlobalManager ||
              (!isRegularUser &&
                this.usersService.isUserInGroup(
                  userToBeUpdated,
                  managedGroups,
                )) ||
              req.user.user.id === userToBeUpdated.id
            );
        }

      case 'Groups':
        switch (methodName) {
          case 'list':
            return !isRegularUser;

          case 'create':
            return isGlobalManager;

          case 'findOne':
          case 'deleteOne':
          case 'update':
            return isGlobalManager || managedGroups.includes(+requestId);
        }
    }
    return true;
  }
}
