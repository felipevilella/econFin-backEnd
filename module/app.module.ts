import { Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "./infra/database/config/environment-config.module";
import { UsersModule } from "./users/controller/users.module";
import { TypeOrmConfigModule } from "./infra/database/typeorm/typeorm.module";
import { UseCaseProxyModule } from "./infra/usecase-proxy/usecase-proxy.module";
import { UserController } from "./users/controller/user.controller";

@Module({
  imports: [
    UseCaseProxyModule.register(),
    UsersModule,
    EnvironmentConfigModule,
    TypeOrmConfigModule,
  ],
  controllers: [UserController],
})
export class AppModule {}
