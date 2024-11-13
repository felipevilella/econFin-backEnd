import { DynamicModule, Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "../database/config/environment-config.module";
import { RepositoriesModule } from "../repositories/repositories.module";
import { UsersRepository } from "module/users/repository/users.repository";

import { UseCaseProxy } from "./usecase-proxy";
import { CreateUserUseCases } from "module/users/usecase/user/createUser.usecase";
import { AuthenticateUserUseCase } from "module/users/usecase/user/authenticateUser.usecase";

@Module({
  imports: [EnvironmentConfigModule, RepositoriesModule],
})
export class UseCaseProxyModule {
  static CREATE_USER_USE_CASE = "createUserUseCase";
  static AUTHENTICATE_USER_USE_CASE = "authenticateUser";

  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        {
          inject: [UsersRepository],
          provide: UseCaseProxyModule.CREATE_USER_USE_CASE,
          useFactory: (userRepository: UsersRepository) =>
            new UseCaseProxy(new CreateUserUseCases(userRepository)),
        },
        {
          inject: [UsersRepository],
          provide: UseCaseProxyModule.AUTHENTICATE_USER_USE_CASE,
          useFactory: (userRepository: UsersRepository) =>
            new UseCaseProxy(new AuthenticateUserUseCase(userRepository)),
        },
      ],
      exports: [
        UseCaseProxyModule.CREATE_USER_USE_CASE,
        UseCaseProxyModule.AUTHENTICATE_USER_USE_CASE,
      ],
    };
  }
}
