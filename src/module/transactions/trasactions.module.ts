import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { Transactions } from "src/infra/entities/transactions.entity";
import { TransactionsController } from "./transactions.controller";
import { Accounts } from "src/infra/entities/accounts.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions, Accounts]),
    UseCaseProxyModule.register(),
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
