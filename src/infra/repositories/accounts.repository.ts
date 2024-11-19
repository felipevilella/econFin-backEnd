import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/users.entity";
import { Repository } from "typeorm";

import {
  createAccounts,
  IAccountsRepository,
} from "src/repositories/accounts.repository.interface";
import { Accounts } from "../entities/accounts.entity";

@Injectable()
export class AccountRepository implements IAccountsRepository {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountRepository: Repository<Accounts>,
  ) {}

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
