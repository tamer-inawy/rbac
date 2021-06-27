import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { GroupsService } from './groups.service';
import { Group } from './group.entity';
import { GroupsController } from './groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
