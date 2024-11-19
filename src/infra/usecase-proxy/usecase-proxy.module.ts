import { DynamicModule, Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "../database/config/environment-config.module";
import { RepositoriesModule } from "../repositories/repositories.module";

import { UseCaseProxy } from "./usecase-proxy";
import { UsersRepository } from "../repositories/users.repository";
import { CreateUserService } from "src/module/users/services/create-user.service";
import { AuthService } from "src/module/auth/services/auth.service";

@Module({
  imports: [EnvironmentConfigModule, RepositoriesModule],
})
export class UseCaseProxyModule {
  static CREATE_USER_SERVICE = "createUserService";
  static AUTHENTICATE_USER_SERVICE = "authService";

  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        {
          inject: [UsersRepository],
          provide: UseCaseProxyModule.CREATE_USER_SERVICE,
          useFactory: (userRepository: UsersRepository) =>
            new UseCaseProxy(new CreateUserService(userRepository)),
        },
        {
          inject: [UsersRepository],
          provide: UseCaseProxyModule.AUTHENTICATE_USER_SERVICE,
          useFactory: (userRepository: UsersRepository) =>
            new UseCaseProxy(new AuthService(userRepository)),
        },
      ],
      exports: [
        UseCaseProxyModule.CREATE_USER_SERVICE,
        UseCaseProxyModule.AUTHENTICATE_USER_SERVICE,
      ],
    };
  }
}
