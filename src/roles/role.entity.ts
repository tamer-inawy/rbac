import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column()
  groupId: number;
}
