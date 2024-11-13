import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "module/infra/entities/users.entity";
import { UseCaseProxyModule } from "module/infra/usecase-proxy/usecase-proxy.module";

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UseCaseProxyModule.register()],
  controllers: [UserController],
})
export class UsersModule {}
