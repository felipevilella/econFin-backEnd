import { DynamicModule, Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "../database/config/environment-config.module";
import { RepositoriesModule } from "../repositories/repositories.module";

import { UseCaseProxy } from "./usecase-proxy";
import { UsersRepository } from "../repositories/users.repository";

import { AuthService } from "src/module/auth/services/auth.service";
import { CreateUserService } from "src/module/users/services/create-user.service";
import { CreateFinancialDivisionService } from "src/module/users/services/create-financial-division.service";
import { AccountRepository } from "../repositories/accounts.repository";

@Module({
  imports: [EnvironmentConfigModule, RepositoriesModule],
})
export class UseCaseProxyModule {
  static CREATE_USER_SERVICE = "createUserService";
  static AUTHENTICATE_USER_SERVICE = "authService";
  static CREATE_FINANCIAL_DIVISION_SERVICE = "createFinancialDivisionService";

  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        {
          inject: [UsersRepository, AccountRepository],
          provide: UseCaseProxyModule.CREATE_USER_SERVICE,
          useFactory: (
            userRepository: UsersRepository,
            accountRepository: AccountRepository,
          ) =>
            new UseCaseProxy(
              new CreateUserService(userRepository, accountRepository),
            ),
        },
        {
          inject: [UsersRepository],
          provide: UseCaseProxyModule.AUTHENTICATE_USER_SERVICE,
          useFactory: (userRepository: UsersRepository) =>
            new UseCaseProxy(new AuthService(userRepository)),
        },
        {
          inject: [UsersRepository],
          provide: UseCaseProxyModule.CREATE_FINANCIAL_DIVISION_SERVICE,
          useFactory: (userRepository: UsersRepository) =>
            new UseCaseProxy(
              new CreateFinancialDivisionService(userRepository),
            ),
        },
      ],
      exports: [
        UseCaseProxyModule.CREATE_USER_SERVICE,
        UseCaseProxyModule.AUTHENTICATE_USER_SERVICE,
        UseCaseProxyModule.CREATE_FINANCIAL_DIVISION_SERVICE,
      ],
    };
  }
}
