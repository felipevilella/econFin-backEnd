import { DynamicModule, Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "../database/config/environment-config.module";
import { RepositoriesModule } from "../repositories/repositories.module";
import { UsersRepository } from "module/users/repository/users.repository";
import { CreateUserUseCase } from "module/users/usecase/createUser.usecase";
import { UseCaseProxy } from "./usecase-proxy";

@Module({
  imports: [EnvironmentConfigModule, RepositoriesModule],
})
export class UseCaseProxyModule {
  static CREATE_USER_USE_CASE = "createUserUseCase";

  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        {
          inject: [UsersRepository],
          provide: UseCaseProxyModule.CREATE_USER_USE_CASE,
          useFactory: (userRepository: UsersRepository) =>
            new UseCaseProxy(new CreateUserUseCase(userRepository)),
        },
      ],
      exports: [UseCaseProxyModule.CREATE_USER_USE_CASE],
    };
  }
}
