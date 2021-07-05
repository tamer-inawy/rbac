import { REQUEST } from '@nestjs/core';
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

import { EditRoleDto } from './dto/edit.role.dto';
import { CreateRoleDto } from 'src/roles/dto/create.role.dto';
import { RolesService } from 'src/roles/roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    @Inject(REQUEST) private req: any,
  ) {}

  @Get()
  list(): Promise<any> {
    if (this.req.user.isRegularUser)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    if (this.req.user.isGlobalManager) return this.rolesService.list();

    return this.rolesService.listByGroups(this.req.user.managedGroups);
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<any> {
    const role = await this.rolesService.findOne(id);

    if (
      this.req.user.isGlobalManager ||
      this.req.user.managedGroups.includes(role.group.id)
    )
      return role;

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Post()
  async create(@Body() roleDto: CreateRoleDto) {
    if (
      this.req.user.isGlobalManager ||
      this.req.user.managedGroups.includes(roleDto.group)
    )
      return this.rolesService.create(roleDto);

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id) {
    const role = await this.rolesService.findOne(id);

    if (
      this.req.user.isGlobalManager ||
      this.req.user.managedGroups.includes(role.group.id)
    )
      return this.rolesService.delete(id);

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() roleDto: EditRoleDto) {
    const role = await this.rolesService.findOne(id);

    if (
      this.req.user.isGlobalManager ||
      (this.req.user.managedGroups.includes(role.group.id) &&
        this.req.user.managedGroups.includes(roleDto.group))
    )
      return this.rolesService.update(id, roleDto);

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
