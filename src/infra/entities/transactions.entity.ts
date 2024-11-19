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
import { Cards } from "./cards.entity";
import { Accounts } from "./accounts.entity";

export enum MOVEMENT_TYPE {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
  INVESTMENT = "INVESTMENT",
}

export enum METHOD_TYPE {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  CASH = "CASH",
}

export enum STATUS {
  PAID = "PAID",
  PENDENT = "PENDENT",
}

export enum TYPE {
  SUPERMARKET = "SUPERMARKET",
  SHOPPING = "SHOPPING",
  GAS_STATION = "GAS_STATION",
  MECHANIC = "MECHANIC",
  LEISURE = "LEISURE",
  BILL = "BILL",
}

@Entity("transactions")
export class Transactions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: "float", nullable: false })
  price: number;

  @Column({
    type: "enum",
    enum: STATUS,
    nullable: false,
  })
  status: STATUS;

  @Column({
    type: "enum",
    enum: MOVEMENT_TYPE,
    nullable: false,
  })
  movementType: MOVEMENT_TYPE;

  @Column({
    type: "enum",
    enum: METHOD_TYPE,
    nullable: false,
  })
  methodType: METHOD_TYPE;

  @Column({
    type: "enum",
    enum: TYPE,
    nullable: false,
  })
  type: TYPE;

  @Column({ nullable: false })
  date: Date;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Users;

  @Column({ nullable: false })
  cardId: string;

  @ManyToOne(() => Cards, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cardId" })
  card: Cards;

  @Column({ nullable: false })
  accountId: string;

  @ManyToOne(() => Accounts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "accountId" })
  account: Accounts;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
