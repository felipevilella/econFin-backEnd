import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/users.entity";
import { Repository } from "typeorm";

import { IAccountsRepository } from "src/repositories/accounts.repository.interface";
import { Accounts } from "../entities/accounts.entity";
import {
  AccountDto,
  createAccounts,
  updateAccountDTO,
} from "src/module/accounts/dto/accounts.dto";

@Injectable()
export class AccountRepository implements IAccountsRepository {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountRepository: Repository<Accounts>,
  ) {}

  async getAccountByUserId(userId: string): Promise<AccountDto> {
    return await this.accountRepository.findOneBy({ userId });
  }

  async updateAccount(
    accountId: string,
    data: updateAccountDTO,
  ): Promise<void> {
    await this.accountRepository.update({ id: accountId }, data);
  }

  async createAccount(account: createAccounts): Promise<void> {
    try {
      const newAccount = this.accountRepository.create(account);
      await this.accountRepository.save(newAccount);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to create account");
    }
  }
}
