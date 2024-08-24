import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/roles/role.entity';
import { CreateRoleDto } from 'src/roles/dto/create.role.dto';
import { EditRoleDto } from 'src/roles/dto/edit.role.dto';
import { Role as Roles } from 'src/roles/role.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) { }

  async create(resource: CreateRoleDto) {
    if (resource.role === Roles.GlobalManager) resource.group = null;

    const newRole = await this.rolesRepository.create(resource);
    const role = await this.rolesRepository.save(newRole);

    return role;
  }

  delete(id: string): Promise<any> {
    return this.rolesRepository.delete(id);
  }

  list(): Promise<Role[]> {
    return this.rolesRepository
      .find({ relations: ['group', 'user'] })
      .then((roles) =>
        roles.map((role) => {
          delete role.user.password;
          return role;
        }),
      );
  }

  listByGroups(groups: Array<number>): Promise<Role[]> {
    return this.rolesRepository
      .find({ relations: ['group', 'user'] })
      .then((roles) =>
        roles.filter((role) => {
          delete role.user.password;
          return groups.includes(role.group?.id);
        }),
      );
  }

  async update(id: string, dto: EditRoleDto) {
    const role = await this.findOne(id);
    if (!role) return null;

    const editedRole = Object.assign(role, dto);
    return this.rolesRepository.save(editedRole);
  }

  findOne(id: string): Promise<Role> {
    return this.rolesRepository.findOne(id, { relations: ['group'] });
  }
}
