import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { Accounts } from "src/infra/entities/accounts.entity";
import { AccountsController } from "./accounts.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts]),
    UseCaseProxyModule.register(),
  ],
  controllers: [AccountsController],
})
export class AccountsModule {}
