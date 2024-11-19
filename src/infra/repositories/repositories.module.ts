import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigModule } from "../database/typeorm/typeorm.module";
import { Users } from "../entities/users.entity";
import { Accounts } from "../entities/accounts.entity";
import { Cards } from "../entities/cards.entity";
import { Transactions } from "../entities/transactions.entity";
import { UsersRepository } from "./users.repository";
import { AccountRepository } from "./accounts.repository";

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([Users, Accounts, Cards, Transactions]),
  ],
  providers: [UsersRepository, AccountRepository],
  exports: [UsersRepository, AccountRepository],
})
export class RepositoriesModule {}
