import { REQUEST } from '@nestjs/core';

import { EditGroupDto } from 'src/groups/dto/edit.group.dto';
import { CreateGroupDto } from 'src/groups/dto/create.group.dto';
import { GroupsService } from 'src/groups/groups.service';
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
  deleteOne(@Param() params) {
    return this.groupsService.delete(params.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() groupDto: EditGroupDto) {
    // console.log(groupDto);
    return this.groupsService.update(id, groupDto);
  }
}
