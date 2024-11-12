import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Double, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity('accounts')
export class Accounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false})
  name: string;

  @Column({ nullable: false})
  total: number;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date

}