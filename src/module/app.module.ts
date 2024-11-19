import { Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "../infra/database/config/environment-config.module";
import { UsersModule } from "./users/users.module";
import { TypeOrmConfigModule } from "../infra/database/typeorm/typeorm.module";
import { UseCaseProxyModule } from "../infra/usecase-proxy/usecase-proxy.module";
import { UserController } from "./users/user.controller";
import { AuthModule } from "./auth/auth.module";
import { AuthController } from "./auth/auth.controller";

@Module({
  imports: [
    UseCaseProxyModule.register(),
    UsersModule,
    AuthModule,
    EnvironmentConfigModule,
    TypeOrmConfigModule,
  ],
  controllers: [UserController, AuthController],
})
export class AppModule {}
