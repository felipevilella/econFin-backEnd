import { Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "../infra/database/config/environment-config.module";
import { UsersModule } from "./users/users.module";
import { TypeOrmConfigModule } from "../infra/database/typeorm/typeorm.module";
import { UseCaseProxyModule } from "../infra/usecase-proxy/usecase-proxy.module";
import { UserController } from "./users/user.controller";
import { AuthModule } from "./auth/auth.module";
import { AuthController } from "./auth/auth.controller";
import { TransactionsModule } from "./transactions/trasactions.module";
import { TransactionsController } from "./transactions/transactions.controller";
import { AccountsModule } from "./accounts/accounts.module";
import { AccountsController } from "./accounts/accounts.controller";
import { PanelModule } from "./panel/panel.module";
import { PanelController } from "./panel/panel.controller";

@Module({
  imports: [
    UseCaseProxyModule.register(),
    UsersModule,
    AuthModule,
    TransactionsModule,
    AccountsModule,
    PanelModule,
    EnvironmentConfigModule,
    TypeOrmConfigModule,
  ],
  controllers: [
    UserController,
    AuthController,
    TransactionsController,
    AccountsController,
    PanelController,
  ],
})
export class AppModule {}
