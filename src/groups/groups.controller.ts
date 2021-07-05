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
  findOne(@Param('id') id): Promise<any> {
    return this.groupsService.findOne(id);
  }

  @Post()
  create(@Body() groupDto: CreateGroupDto) {
    return this.groupsService.create(groupDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id) {
    return this.groupsService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() groupDto: EditGroupDto) {
    return this.groupsService.update(id, groupDto);
  }
}
