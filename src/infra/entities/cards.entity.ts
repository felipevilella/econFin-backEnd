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

export enum BANK {
  ITAU = "ITAU",
  SANTANDER = "SANTANDER",
  NUBANK = "NUBANK",
  INTER = "INTER",
}

export enum TYPE_USER {
  PRINCIPAL = "PRINCIPAL",
  FINANCE_DIVISION = "FINANCE_DIVISION",
}

@Entity("cards")
export class Cards {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  number: number;

  @Column({
    type: "enum",
    enum: BANK,
  })
  bank: BANK;

  @Column({ nullable: false })
  limit: number;

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
