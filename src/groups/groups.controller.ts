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

import { EditGroupDto } from 'src/groups/dto/edit.group.dto';
import { CreateGroupDto } from 'src/groups/dto/create.group.dto';
import { GroupsService } from 'src/groups/groups.service';

@Controller('groups')
export class GroupsController {
  constructor(
    @Inject(REQUEST) private req: any,
    private readonly groupsService: GroupsService,
  ) {}

  @Get()
  list(): Promise<any> {
    return this.req.user.isGlobalManager
      ? this.groupsService.list()
      : this.groupsService.listByGroups(this.req.user.managedGroups);
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<any> {
    const group = await this.groupsService.findOne(id);
    if (this.req.user.isGlobalManager) return group;

    for (let role of this.req.user.user.roles) {
      if (role.group === group.id) return group;
    }
  }

  @Post()
  create(@Body() groupDto: CreateGroupDto) {
    return this.groupsService.create(groupDto);
  }

  @Delete(':id')
  deleteOne(@Param() params) {
    return this.groupsService.delete(params.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() groupDto: EditGroupDto) {
    // console.log(groupDto);
    return this.groupsService.update(id, groupDto);
  }
}
