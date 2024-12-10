import Encryption, { EncryptedData } from "src/infra/helpers/encryption.helper";
import { AccountRepository } from "src/infra/repositories/accounts.repository";

import { UserJWT } from "src/module/auth/dto/auth.dto";
import { AccountDto, IAccountMapper } from "../dto/accounts.dto";
import { AccountMap } from "../mapper/accounts.mapper";

export class getAccountService {
  constructor(private accountRepository: AccountRepository) {}

  private async decryptData(encryptedData: EncryptedData): Promise<string> {
    const encryption = new Encryption();

    return await encryption.decrypt(encryptedData);
  }

  private async findAccounts(userId: string): Promise<AccountDto> {
    const transactions =
      await this.accountRepository.getAccountByUserId(userId);

    return transactions;
  }

  private async getAccount(user: UserJWT): Promise<IAccountMapper> {
    const account = await this.findAccounts(user.id);

    account.total = await this.decryptData({
      encryptedData: account.total,
      securityKey: account.securityKey,
    });

    account.estimatedTotal = await this.decryptData({
      encryptedData: account.estimatedTotal,
      securityKey: account.securityKeyEstimated,
    });

    return AccountMap.toDTO(account);
  }

  async execute(user: UserJWT): Promise<IAccountMapper> {
    const account = await this.getAccount(user);

    return account;
  }
}
