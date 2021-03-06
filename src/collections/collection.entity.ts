import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Group } from 'src/groups/group.entity';
import { Item } from 'src/items/item.entity';

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Group, (group) => group.collections)
  grp: Group;

  @OneToMany(() => Item, (item) => item.parent)
  items: Item[];
}
