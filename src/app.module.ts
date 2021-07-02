import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from 'src/app.controller';
import { UsersModule } from 'src/users/users.module';
import { GroupsModule } from 'src/groups/groups.module';
import { RolesModule } from 'src/roles/roles.module';
import { CollectionsModule } from 'src/collections/collections.module';
import { ItemsModule } from 'src/items/items.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    GroupsModule,
    RolesModule,
    CollectionsModule,
    ItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
