import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { EditItemDto } from 'src/items/dto/edit.item.dto';
import { CreateItemDto } from 'src/items/dto/create.item.dto';
import { ItemsService } from 'src/items/items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  list(): Promise<any> {
    return this.itemsService.list();
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
