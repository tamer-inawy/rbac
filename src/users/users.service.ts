import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/user.entity';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { EditUserDto } from 'src/users/dto/edit.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(resource: CreateUserDto) {
    resource.password = await bcrypt.hash(
      resource.password,
      +process.env.BCRYPT_SALT,
    );
    const newUser = await this.usersRepository.create(resource);
    const user = await this.usersRepository.save(newUser);
    delete user?.password;

    return user;
  }

  delete(id: string): Promise<any> {
    return this.usersRepository.delete(id);
  }

  async list(): Promise<User[]> {
    const list = await this.usersRepository.find({
      relations: ['roles', 'roles.group'],
    });

    // TODO: Elemenate the password from the entity using @Column({select: false}) instead of the following map
    return list.map((user) => {
      delete user?.password;
      return user;
    });
  }

  listByGroups(userId: number, groups: Array<number>): Promise<User[]> {
    return this.usersRepository
      .find({
        relations: ['roles', 'roles.group'],
      })
      .then((list) => {
        // TODO: Replace the next filter with db query for better performance
        return list.filter((user) => {
          delete user?.password;
          for (const role of user.roles) {
            if (groups.indexOf(role.group?.id) !== -1) return true;
          }
          return user.id === userId;
        });
      });
  }

  async update(id: string, dto: EditUserDto) {
    if (dto.password)
      dto.password = await bcrypt.hash(dto.password, +process.env.BCRYPT_SALT);

    const user = await this.findOne(id);
    if (!user) return null;

    const editedUser = Object.assign(user, dto);
    return this.usersRepository.save(editedUser);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['roles', 'roles.group'],
    });
    delete user?.password;
    return user;
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.group'],
    });
  }

  isUserInGroup(user: User, groups: Array<number>) {
    for (const r of user.roles) {
      if (groups.indexOf(r.group?.id) !== -1) return true;
    }
    return false;
  }
}
