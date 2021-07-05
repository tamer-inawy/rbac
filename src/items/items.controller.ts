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

import { EditItemDto } from 'src/items/dto/edit.item.dto';
import { CreateItemDto } from 'src/items/dto/create.item.dto';
import { ItemsService } from 'src/items/items.service';

@Controller('items')
export class ItemsController {
  constructor(
    @Inject(REQUEST) private req: any,
    private readonly itemsService: ItemsService,
  ) {}

  @Get()
  list(): Promise<any> {
    if (this.req.user.isGlobalManager) return this.itemsService.list();

    return this.itemsService.listByGroups(this.req.user.managedGroups);
  }

  @Get(':id')
  findOne(@Param('id') id): Promise<any> {
    return this.itemsService.findOne(id);
  }

  @Post()
  async create(@Body() itemDto: CreateItemDto) {
    return this.itemsService.create(itemDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id) {
    return this.itemsService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() itemDto: EditItemDto) {
    return this.itemsService.update(id, itemDto);
  }
}
