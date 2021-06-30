import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { EditRoleDto } from './dto/edit.role.dto';
import { CreateRoleDto } from 'src/roles/dto/create.role.dto';
import { RolesService } from 'src/roles/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  list(): Promise<any> {
    return this.rolesService.list();
  }

  @Get(':id')
  findOne(@Param('id') id): Promise<any> {
    // console.log(params);
    return this.rolesService.findOne(id);
  }

  @Post()
  async create(@Body() roleDto: CreateRoleDto) {
    return this.rolesService.create(roleDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id) {
    return this.rolesService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() roleDto: EditRoleDto) {
    return this.rolesService.update(id, roleDto);
  }
}
