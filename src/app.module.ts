import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UsersModule } from 'src/users/users.module';
import { GroupsModule } from './groups/groups.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, GroupsModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
