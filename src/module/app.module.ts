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

@Module({
  imports: [
    UseCaseProxyModule.register(),
    UsersModule,
    AuthModule,
    TransactionsModule,
    EnvironmentConfigModule,
    TypeOrmConfigModule,
  ],
  controllers: [UserController, AuthController, TransactionsController],
})
export class AppModule {}
