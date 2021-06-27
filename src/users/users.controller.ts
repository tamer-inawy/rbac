import { EditUserDto } from './dto/edit.user.dto';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { UsersService } from 'src/users/users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(): Promise<any> {
    return this.usersService.list();
  }

  @Get(':id')
  findOne(@Param() params): Promise<any> {
    // console.log(params);
    return this.usersService.findOne(params.id);
  }

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Delete(':id')
  deleteOne(@Param() params) {
    return this.usersService.delete(params.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: EditUserDto) {
    return this.usersService.update(id, userDto);
  }
}
