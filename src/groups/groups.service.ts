import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group } from 'src/groups/group.entity';
import { CreateGroupDto } from 'src/groups/dto/create.group.dto';
import { EditGroupDto } from 'src/groups/dto/edit.group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
  ) {}

  async create(resource: CreateGroupDto) {
    const newGroup = await this.groupsRepository.create(resource);
    const group = await this.groupsRepository.save(newGroup);

    return group;
  }

  delete(id: string): Promise<any> {
    return this.groupsRepository.delete(id);
  }

  list(): Promise<Group[]> {
    return this.groupsRepository.find();
  }

  async update(id: string, dto: EditGroupDto) {
    const group = await this.findOne(id);
    const editedGroup = Object.assign(group, dto);

    return this.groupsRepository.save(editedGroup);
  }

  findOne(id: string): Promise<Group> {
    return this.groupsRepository.findOne(id);
  }
}
