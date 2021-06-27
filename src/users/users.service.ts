import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/user.entity';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { EditUserDto } from 'src/users/dto/edit.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(resource: CreateUserDto) {
    const newUser = await this.usersRepository.create(resource);
    const user = await this.usersRepository.save(newUser);

    return user;
  }

  delete(id: string): Promise<any> {
    return this.usersRepository.delete(id);
  }

  list(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(id: string, dto: EditUserDto) {
    const user = await this.findOne(id);
    const editedUser = Object.assign(user, dto);
    return this.usersRepository.save(editedUser);
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }
}
