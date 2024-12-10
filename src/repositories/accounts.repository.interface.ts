import {
  AccountDto,
  createAccounts,
  updateAccountDTO,
} from "src/module/accounts/dto/accounts.dto";

export interface IAccountsRepository {
  createAccount(account: createAccounts): Promise<void>;
  getAccountByUserId(userId: string): Promise<AccountDto>;
  updateAccount(accountId: string, data: updateAccountDTO): Promise<void>;
}
