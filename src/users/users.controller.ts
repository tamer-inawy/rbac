import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { EditUserDto } from 'src/users/dto/edit.user.dto';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(REQUEST) private req: any,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  list(): Promise<any> {
    return this.req.user.isGlobalManager
      ? this.usersService.list()
      : this.usersService.listByGroups(
          this.req.user.user.id,
          this.req.user.managedGroups,
        );
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<any> {
    const user: User = await this.usersService.findOne(id);

    if (
      this.req.user.isGlobalManager ||
      this.usersService.isUserInGroup(user, this.req.user.managedGroups) ||
      (this.req.user.user.id === user.id && this.req.user.isRegularUser)
    )
      return user;
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    // TODO: Combine creating users with roles for better handling,
    //       for now the user is allowed to create a new user if he is a global manager or a manager for any group
    if (
      !this.req.user.isGlobalManager &&
      this.req.user.managedGroups.length === 0
    )
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.usersService.create(userDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id) {
    const user: User = await this.usersService.findOne(id);
    if (
      this.req.user.isGlobalManager ||
      this.usersService.isUserInGroup(user, this.req.user.managedGroups) ||
      this.req.user.user.id === user.id
    )
      // TODO: delete the roles of the user before deleting the user, for now it's handled by db cascade
      return this.usersService.delete(id);

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userDto: EditUserDto) {
    const user: User = await this.usersService.findOne(id);
    if (
      this.req.user.isGlobalManager ||
      this.usersService.isUserInGroup(user, this.req.user.managedGroups) ||
      this.req.user.user.id === user.id
    )
      return this.usersService.update(id, userDto);
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
