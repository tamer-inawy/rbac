import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { Collection } from 'src/collections/collection.entity';
import { Role } from 'src/roles/role.entity';

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Collection, (collection) => collection.grp)
  collections: Collection[];

  @OneToMany(() => Role, (role) => role.group)
  roles: Role[];
}
