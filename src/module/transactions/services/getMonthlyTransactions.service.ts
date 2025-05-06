import {
  METHOD_TYPE,
  MOVEMENT_TYPE,
  STATUS,
} from "src/infra/entities/transactions.entity";
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
  totalPending: number;
  totalTransactionsEntry: number;
  totalTransactionsExit: number;
  remainingBalance: number;
  transactions: {
    entries: ITransactionsMapDTO[];
    exits: ITransactionsMapDTO[];
    creditCard: ITransactionsMapDTO[];
  };
  userDivision: userDivision;
  transactionCreditCard?: {
    total: number;
    transactions: ITransactionsMapDTO[];
  };
}

export class GetMonthlyTransactionsService {
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

  private sortByDate(transactions: ITransactionsMapDTO[]) {
    return transactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
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
    date: Date,
  ): Promise<ITransactionsMapDTO[]> {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0) - 1);

    console.log(startDate);
    console.log(endDate);

    const transactions =
      await this.transactionsRepository.getTransactionsByUserId(
        userId,
        date,
        endDate,
      );

    const transactionMap: ITransactionsMapDTO[] = [];

    for (const transaction of transactions) {
      transaction.price = await this.decryptData({
        encryptedData: transaction.price,
        securityKey: transaction.securityKey,
      });

      transactionMap.push(TransactionsMap.toDTO(transaction));
    }

    return transactionMap;
  }
  private async monthlyTransactions(
    userId: string,
    date: Date,
  ): Promise<IResponsePanel> {
    let transactions = await this.getTransactions(userId, date);
    const account = await this.getAccount(userId);
    const userDivision = await this.getUserDivision(userId);

    const entryTransactions = transactions.filter(
      (transaction) => transaction.movementType === MOVEMENT_TYPE.ENTRY,
    );

    const exitTransactions = transactions.filter(
      (transaction) => transaction.movementType === MOVEMENT_TYPE.EXIT,
    );

    const transactionCreditCard = transactions.filter(
      (transaction) => transaction.methodType === METHOD_TYPE.CREDIT_CARD,
    );

    const pendentTransactions = transactions.filter(
      (transactions) => transactions.status === STATUS.PENDENT,
    );

    transactions = transactions.filter(
      (transaction) => transaction.methodType !== METHOD_TYPE.CREDIT_CARD,
    );

    const totalTransactionsEntry = entryTransactions.length;
    const totalTransactionsExit = exitTransactions.length;
    const remainingBalance = currency(account.total).value;

    let totalAmountEntry = currency(0).value;
    let totalAmountExit = currency(0).value;
    let totalTransactionsCard = currency(0).value;
    let totalPending = currency(0).value;

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

    pendentTransactions.forEach((transaction) => {
      totalPending += currency(transaction.price).value;
    });

    exitTransactions.forEach((transaction) => {
      totalAmountExit += currency(transaction.price).value;
    });

    transactionCreditCard.forEach((transaction) => {
      totalTransactionsCard += currency(transaction.price).value;
    });

    return {
      totalAmountEntry: totalAmountEntry,
      totalAmountExit: totalAmountExit,
      totalPending: totalPending,
      totalTransactionsEntry,
      remainingBalance,
      totalTransactionsExit,
      userDivision: userDivisionData,
      transactions: {
        entries: this.sortByDate(entryTransactions),
        exits: this.sortByDate(exitTransactions),
        creditCard: this.sortByDate(transactionCreditCard),
      },
    };
  }

  async execute(user: UserJWT, date: Date): Promise<IResponsePanel> {
    const data = await this.monthlyTransactions(user.id, date);

    return data;
  }
}
