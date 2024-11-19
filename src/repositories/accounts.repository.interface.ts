export interface createAccounts {
  total: string;
  userId: string;
  securityKey: string;
}

export interface IAccountsRepository {
  createAccount(account: createAccounts): Promise<void>;
}
