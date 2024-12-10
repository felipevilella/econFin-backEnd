import { DynamicModule, Module } from "@nestjs/common";
import { EnvironmentConfigModule } from "../database/config/environment-config.module";
import { RepositoriesModule } from "../repositories/repositories.module";

import { UseCaseProxy } from "./usecase-proxy";
import { UsersRepository } from "../repositories/users.repository";

import { AuthService } from "src/module/auth/services/auth.service";
import { CreateUserService } from "src/module/users/services/create-user.service";
import { CreateFinancialDivisionService } from "src/module/users/services/create-financial-division.service";
import { AccountRepository } from "../repositories/accounts.repository";
import { TransactionsRepository } from "../repositories/transactions.repository";
import { FindTransactionsService } from "src/module/transactions/services/findTransactions.service";
import { CreateOrUpdateTransactionService } from "src/module/transactions/services/createOrUpdateTransactions.service";
import { getAccountService } from "src/module/accounts/services/getAccount.services";

@Module({
  imports: [EnvironmentConfigModule, RepositoriesModule],
})
export class UseCaseProxyModule {
  static CREATE_USER_SERVICE = "createUserService";
  static AUTHENTICATE_USER_SERVICE = "authService";
  static CREATE_FINANCIAL_DIVISION_SERVICE = "createFinancialDivisionService";
  static CREATE_OR_UPDATE_TRANSACTIONS_SERVICE =
    "CreateOrUpdateTransactionService";
  static FIND_TRANSACTIONS_SERVICE = "findTransactionsService";
  static GET_ACCOUNT_SERVICE = "getAccountService";

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
        {
          inject: [AccountRepository, TransactionsRepository],
          provide: UseCaseProxyModule.CREATE_OR_UPDATE_TRANSACTIONS_SERVICE,
          useFactory: (
            accountRepository: AccountRepository,
            transactionsRepository: TransactionsRepository,
          ) =>
            new UseCaseProxy(
              new CreateOrUpdateTransactionService(
                accountRepository,
                transactionsRepository,
              ),
            ),
        },
        {
          inject: [TransactionsRepository],
          provide: UseCaseProxyModule.FIND_TRANSACTIONS_SERVICE,
          useFactory: (transactionsRepository: TransactionsRepository) =>
            new UseCaseProxy(
              new FindTransactionsService(transactionsRepository),
            ),
        },
        {
          inject: [AccountRepository],
          provide: UseCaseProxyModule.GET_ACCOUNT_SERVICE,
          useFactory: (accountRepository: AccountRepository) =>
            new UseCaseProxy(new getAccountService(accountRepository)),
        },
      ],
      exports: [
        UseCaseProxyModule.CREATE_USER_SERVICE,
        UseCaseProxyModule.AUTHENTICATE_USER_SERVICE,
        UseCaseProxyModule.CREATE_FINANCIAL_DIVISION_SERVICE,
        UseCaseProxyModule.CREATE_OR_UPDATE_TRANSACTIONS_SERVICE,
        UseCaseProxyModule.FIND_TRANSACTIONS_SERVICE,
        UseCaseProxyModule.GET_ACCOUNT_SERVICE,
      ],
    };
  }
}
