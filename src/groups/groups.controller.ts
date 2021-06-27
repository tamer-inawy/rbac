import { EditGroupDto } from './dto/edit.group.dto';
import { CreateGroupDto } from 'src/groups/dto/create.group.dto';
import { GroupsService } from 'src/groups/groups.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  list(): Promise<any> {
    return this.groupsService.list();
  }

  @Get(':id')
  findOne(@Param() params): Promise<any> {
    return this.groupsService.findOne(params.id);
  }

  @Post()
  async create(@Body() groupDto: CreateGroupDto) {
    return this.groupsService.create(groupDto);
  }

  @Delete(':id')
  deleteOne(@Param() params) {
    return this.groupsService.delete(params.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() groupDto: EditGroupDto) {
    console.log(groupDto);
    return this.groupsService.update(id, groupDto);
  }
}
