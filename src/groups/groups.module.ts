import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { GroupsService } from 'src/groups/groups.service';
import { Group } from 'src/groups/group.entity';
import { GroupsController } from 'src/groups/groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
