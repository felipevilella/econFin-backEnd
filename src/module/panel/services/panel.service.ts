import { MOVEMENT_TYPE, STATUS } from "src/infra/entities/transactions.entity";
import Encryption, { EncryptedData } from "src/infra/helpers/encryption.helper";
import { AccountRepository } from "src/infra/repositories/accounts.repository";
import { TransactionsRepository } from "src/infra/repositories/transactions.repository";
import { UsersRepository } from "src/infra/repositories/users.repository";
import {
  AccountDto,
  IAccountMapper,
} from "src/module/accounts/dto/accounts.dto";
import { AccountMap } from "src/module/accounts/mapper/accounts.mapper";
import { UserJWT } from "src/module/auth/dto/auth.dto";
import {
  ITransactionsMapDTO,
  TransactionsMap,
} from "src/module/transactions/mapper/transactions.mapper";

import * as currency from "currency.js";

interface userDivision {
  id: string;
  name: string;
  total: number;
  status: string;
}

export interface IResponsePanel {
  totalAmountEntry: number;
  totalAmountExit: number;
  totalTransactionsEntry: number;
  totalTransactionsExit: number;
  remainingBalance: number;
  transactions: ITransactionsMapDTO[];
  userDivision: userDivision;
}

export class PanelService {
  constructor(
    private accountRepository: AccountRepository,
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  private async decryptData(encryptedData: EncryptedData): Promise<string> {
    const encryption = new Encryption();

    return await encryption.decrypt(encryptedData);
  }

  private async findAccounts(userId: string): Promise<AccountDto> {
    const account = await this.accountRepository.getAccountByUserId(userId);

    return account;
  }

  private async getAccount(userId: string): Promise<IAccountMapper> {
    const account = await this.findAccounts(userId);

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

  private async getUserDivision(userId: string) {
    const userDivision = this.usersRepository.getUserDivision(userId);

    return userDivision;
  }

  private async getTransactions(
    userId: string,
  ): Promise<ITransactionsMapDTO[]> {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);

    const transactions =
      await this.transactionsRepository.getTransactionsByUserId(
        userId,
        startDate,
        endDate,
      );
    const transactionMap: ITransactionsMapDTO[] = [];

    transactions.map(async (transaction) => {
      transaction.price = await this.decryptData({
        encryptedData: transaction.price,
        securityKey: transaction.securityKey,
      });

      transactionMap.push(TransactionsMap.toDTO(transaction));
    });

    return transactionMap;
  }

  private sortByDate(transactions: ITransactionsMapDTO[]) {
    return transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async formatDataPanel(userId: string): Promise<IResponsePanel> {
    const transactions = await this.getTransactions(userId);
    const account = await this.getAccount(userId);
    const userDivision = await this.getUserDivision(userId);

    const entryTransactions = transactions.filter(
      (transaction) => transaction.movementType === MOVEMENT_TYPE.ENTRY,
    );

    const exitTransactions = transactions.filter(
      (transaction) => transaction.movementType === MOVEMENT_TYPE.EXIT,
    );

    const totalTransactionsEntry = entryTransactions.length;
    const totalTransactionsExit = exitTransactions.length;
    const remainingBalance = currency(account.total).value;

    let totalAmountEntry = currency(0).value;
    let totalAmountExit = currency(0).value;
    let userDivisionData: userDivision = {
      id: null,
      name: null,
      total: 0,
      status: null,
    };

    if (userDivision) {
      userDivisionData.name = userDivision.name;
      userDivisionData.id = userDivision.id;
    }

    entryTransactions.forEach((transaction) => {
      totalAmountEntry += currency(transaction.price).value;
    });

    exitTransactions.map((transaction) => {
      totalAmountExit += currency(transaction.price).value;

      if (userDivision.id === transaction.userDivisionId) {
        userDivisionData.total += currency(transaction.divisionValue).value;
      }
    });

    return {
      totalAmountEntry: totalAmountEntry,
      totalAmountExit: totalAmountExit,
      totalTransactionsEntry,
      remainingBalance,
      totalTransactionsExit,
      userDivision: userDivisionData,
      transactions: this.sortByDate(transactions),
    };
  }

  async execute(user: UserJWT): Promise<IResponsePanel> {
    const data = await this.formatDataPanel(user.id);

    return data;
  }
}
