import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";

export enum PROVIDER_SOCIAL_LOGIN {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
  FACEBOOK = "FACEBOOK",
  PLATFORM = "PLATFORM",
}

export enum TYPE_USER {
  PRINCIPAL = "PRINCIPAL",
  FINANCE_DIVISION = "FINANCE_DIVISION",
}

@Entity("users")
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  externalId: string;

  @Column({
    type: "enum",
    enum: PROVIDER_SOCIAL_LOGIN,
    default: PROVIDER_SOCIAL_LOGIN.PLATFORM,
  })
  provider: PROVIDER_SOCIAL_LOGIN;

  @Column({
    type: "enum",
    enum: TYPE_USER,
    default: TYPE_USER.PRINCIPAL,
  })
  type: TYPE_USER;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: Users;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
