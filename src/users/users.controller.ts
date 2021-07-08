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
import { User } from 'src/users/user.entity';

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
    return this.usersService.create(userDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id) {
    // TODO: delete the roles of the user before deleting the user, for now it's handled by db cascade
    return this.usersService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userDto: EditUserDto) {
    return this.usersService.update(id, userDto);
  }
}
