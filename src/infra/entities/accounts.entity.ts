import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Users } from "./users.entity";

@Entity("accounts")
export class Accounts {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  total: number;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Users;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
