import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/roles/role.entity';
import { CreateRoleDto } from 'src/roles/dto/create.role.dto';
import { EditRoleDto } from 'src/roles/dto/edit.role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  async create(resource: CreateRoleDto) {
    const newRole = await this.rolesRepository.create(resource);
    const role = await this.rolesRepository.save(newRole);

    return role;
  }

  delete(id: string): Promise<any> {
    return this.rolesRepository.delete(id);
  }

  list(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async update(id: string, dto: EditRoleDto) {
    const role = await this.findOne(id);
    const editedRole = Object.assign(role, dto);
    return this.rolesRepository.save(editedRole);
  }

  findOne(id: string): Promise<Role> {
    return this.rolesRepository.findOne(id);
  }
}
