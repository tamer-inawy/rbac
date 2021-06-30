import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';

import { Role as RoleEnum } from 'src/auth/role.enum';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: RoleEnum })
  role: RoleEnum;

  @Column()
  groupid: number | null;

  @ManyToOne((type) => User, (user) => user.roles)
  user: User;
}
