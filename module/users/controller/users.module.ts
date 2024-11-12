import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { CreateUserController } from "./createUser.controller";
import { CreateUserUseCase } from "../usecase/createUser.usecase";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "module/infra/entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [CreateUserUseCase],
  exports: [CreateUserUseCase],
  controllers: [UserController, CreateUserController],
})
export class UsersModule {}

// @Module({
//   imports: [TypeOrmModule.forFeature([UserEntity])],
//   providers: [UsersService],
//   exports: [UsersService],
//   controllers: [UsersController],
// })
// export class UsersModule {}
