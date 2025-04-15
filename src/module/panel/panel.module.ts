import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { Transactions } from "src/infra/entities/transactions.entity";

import { Accounts } from "src/infra/entities/accounts.entity";
import { Users } from "src/infra/entities/users.entity";
import { PanelController } from "./panel.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions, Accounts, Users]),
    UseCaseProxyModule.register(),
  ],
  controllers: [PanelController],
})
export class PanelModule {}
