import { ItemsService } from 'src/items/items.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CollectionsService } from 'src/collections/collections.service';
import { IS_PUBLIC_KEY } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Action } from 'src/auth/enums/action.enum';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private rolesService: RolesService,
    private itemsService: ItemsService,
    private readonly collectionsService: CollectionsService,
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

    const className = context.getClass().name.replace('Controller', '');
    const methodName = context.getHandler().name; // "create"
    const requestId = req.params.id;
    switch (className) {
      case 'Users':
        const userToBeUpdated: User = await this.usersService.findOne(
          requestId,
        );
        switch (methodName) {
          case Action.Create:
            if (!isGlobalManager && managedGroups.length === 0) return false;
            return true;

          case Action.Delete:
          case Action.Update:
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

          case Action.Find:
            return (
              isGlobalManager ||
              this.usersService.isUserInGroup(userToBeUpdated, managedGroups) ||
              req.user.user.id === userToBeUpdated.id
            );
        }

      case 'Groups':
        switch (methodName) {
          case Action.List:
            return !isRegularUser;

          case Action.Create:
            return isGlobalManager;

          case Action.Find:
          case Action.Delete:
          case Action.Update:
            return isGlobalManager || managedGroups.includes(+requestId);
        }

      case 'Roles':
        const roleToBeUpdated = await this.rolesService.findOne(requestId);
        switch (methodName) {
          case Action.List:
            return !isRegularUser;

          case Action.Find:
            return (
              roleToBeUpdated &&
              (isGlobalManager ||
                managedGroups.includes(roleToBeUpdated.group.id))
            );

          case Action.Create:
            return isGlobalManager || managedGroups.includes(req.body.group);

          case Action.Delete:
            return (
              roleToBeUpdated &&
              (isGlobalManager ||
                managedGroups.includes(roleToBeUpdated.group.id))
            );

          case Action.Update:
            return (
              roleToBeUpdated &&
              (isGlobalManager ||
                (managedGroups.includes(roleToBeUpdated.group.id) &&
                  managedGroups.includes(req.body.group)))
            );
        }

      case 'Collections':
        const collectionToBeUpdated = await this.collectionsService.findOne(
          requestId,
        );
        switch (methodName) {
          case Action.List:
            return !isRegularUser;

          case Action.Create:
            return isGlobalManager || managedGroups.includes(req.body.grp);

          case Action.Find:
          case Action.Delete:
            return (
              isGlobalManager ||
              managedGroups.includes(collectionToBeUpdated?.grp?.id)
            );

          case Action.Update:
            return (
              isGlobalManager ||
              (managedGroups.includes(collectionToBeUpdated?.grp?.id) &&
                (!req.body.grp || managedGroups.includes(req.body.grp)))
            );
        }

      case 'Items':
        const itemToBeUpdated = await this.itemsService.findOne(requestId);

        switch (methodName) {
          case Action.List:
            return !isRegularUser;

          case Action.Create:
            const allowedCollections = await this.collectionsService
              .listByGroups(managedGroups)
              .then((collections) =>
                collections.map((collection) => collection.id),
              );
            return (
              isGlobalManager || allowedCollections.includes(+req.body.parent)
            );

          case Action.Find:
          case Action.Update:
          case Action.Delete:
            if (!itemToBeUpdated) return false;

            return (
              isGlobalManager ||
              managedGroups.includes(itemToBeUpdated.parent.grp.id)
            );
        }
    }
    return true;
  }
}
