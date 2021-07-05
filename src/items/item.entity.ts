import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';

import { Collection } from 'src/collections/collection.entity';

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((type) => Collection, (collection) => collection.items)
  parent: Collection;
}
