import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CollectionsModule } from 'src/collections/collections.module';
import { Item } from 'src/items/item.entity';
import { ItemsService } from 'src/items/items.service';
import { ItemsController } from './items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), CollectionsModule],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService],
})
export class ItemsModule {}
