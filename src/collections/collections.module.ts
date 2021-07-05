import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Collection } from 'src/collections/collection.entity';
import { CollectionsService } from 'src/collections/collections.service';
import { CollectionsController } from 'src/collections/collections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  providers: [CollectionsService],
  controllers: [CollectionsController],
  exports: [CollectionsService],
})
export class CollectionsModule {}
