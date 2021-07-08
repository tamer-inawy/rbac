import { REQUEST } from '@nestjs/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { EditRoleDto } from 'src/roles/dto/edit.role.dto';
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
    if (this.req.user.isGlobalManager) return this.rolesService.list();

    return this.rolesService.listByGroups(this.req.user.managedGroups);
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<any> {
    return await this.rolesService.findOne(id);
  }

  @Post()
  async create(@Body() roleDto: CreateRoleDto) {
    return this.rolesService.create(roleDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id) {
    return this.rolesService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() roleDto: EditRoleDto) {
    return this.rolesService.update(id, roleDto);
  }
}
