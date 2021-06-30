import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { EditCollectionDto } from './dto/edit.collection.dto';
import { CreateCollectionDto } from 'src/collections/dto/create.collection.dto';
import { CollectionsService } from 'src/collections/collections.service';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  list(): Promise<any> {
    return this.collectionsService.list();
  }

  @Get(':id')
  findOne(@Param('id') id): Promise<any> {
    // console.log(params);
    return this.collectionsService.findOne(id);
  }

  @Post()
  async create(@Body() collectionDto: CreateCollectionDto) {
    return this.collectionsService.create(collectionDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id) {
    return this.collectionsService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() collectionDto: EditCollectionDto) {
    return this.collectionsService.update(id, collectionDto);
  }
}
