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
    if (this.req.user.isRegularUser)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return this.req.user.isGlobalManager
      ? this.groupsService.list()
      : this.groupsService.listByGroups(this.req.user.managedGroups);
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<any> {
    if (this.req.user.isRegularUser)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const group = await this.groupsService.findOne(id);
    if (this.req.user.isGlobalManager) return group;

    for (const role of this.req.user.user.roles) {
      if (role.group === group.id) return group;
    }
  }

  @Post()
  create(@Body() groupDto: CreateGroupDto) {
    if (!this.req.user.isGlobalManager)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return this.groupsService.create(groupDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id) {
    if (
      this.req.user.isGlobalManager ||
      this.req.user.managedGroups.includes(id)
    )
      return this.groupsService.delete(id);

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() groupDto: EditGroupDto) {
    if (
      this.req.user.isGlobalManager ||
      this.req.user.managedGroups.includes(id)
    )
      return this.groupsService.update(id, groupDto);

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
