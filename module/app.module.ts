import { Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "./infra/database/config/environment-config.module";
import { UsersModule } from "./users/controller/users.module";
import { TypeOrmConfigModule } from "./infra/database/typeorm/typeorm.module";

@Module({
  imports: [EnvironmentConfigModule, TypeOrmConfigModule, UsersModule],
})
export class AppModule {}
