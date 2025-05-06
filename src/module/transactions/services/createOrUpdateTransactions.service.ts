import { AccountRepository } from "src/infra/repositories/accounts.repository";
import Encryption, { EncryptedData } from "src/infra/helpers/encryption.helper";
import { TransactionsRepository } from "src/infra/repositories/transactions.repository";

import { UserJWT } from "src/module/auth/dto/auth.dto";
import { MOVEMENT_TYPE, STATUS } from "src/infra/entities/transactions.entity";
import {
  CreateTransactions,
  CreateTransactionsDto,
} from "../dto/transaction.dto";
import { AccountDto } from "src/module/accounts/dto/accounts.dto";
import { add, addMonths } from "date-fns";
import { TransactionsDTO } from "src/repositories/transactions.repository.interface";

interface ICalculateTransactions {
  total: number;
  estimatedTotal: number;
}

interface IUpdateAccount {
  accountId: string;
  total: number;
  estimatedTotal: number;
}

export class CreateOrUpdateTransactionService {
  constructor(
    private accountRepository: AccountRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  private async encryptionData(data: string): Promise<EncryptedData> {
    const encryption = new Encryption();

    return await encryption.encrypt(data);
  }

  private async decryptData(encryptedData: EncryptedData): Promise<string> {
    const encryption = new Encryption();

    return await encryption.decrypt(encryptedData);
  }

  private async getAccount(userId: string): Promise<AccountDto> {
    const account = await this.accountRepository.getAccountByUserId(userId);

    return account;
  }

  private async getTransaction(
    transactionId: string,
  ): Promise<TransactionsDTO> {
    const transaction =
      await this.transactionsRepository.getTransactionsById(transactionId);

    return transaction;
  }

  private async updateAccount(data: IUpdateAccount): Promise<void> {
    const { accountId, estimatedTotal, total } = data;

    const encryptTotal = await this.encryptionData(String(total));
    const encryptEstimated = await this.encryptionData(
      String(estimatedTotal ? estimatedTotal : 0),
    );

    await this.accountRepository.updateAccount(accountId, {
      securityKey: encryptTotal.securityKey,
      total: encryptTotal.encryptedData,
      estimatedTotal: encryptEstimated.encryptedData,
      securityKeyEstimated: encryptEstimated.securityKey,
    });
  }

  private async calculateTransactions(
    account: AccountDto,
    transaction: CreateTransactions,
  ): Promise<ICalculateTransactions> {
    const { total, estimatedTotal, securityKeyEstimated, securityKey } =
      account;

    let totalAccount = Number(
      await this.decryptData({ encryptedData: total, securityKey }),
    );

    let estimatedTotalAccount;

    if (securityKeyEstimated) {
      estimatedTotalAccount = Number(
        await this.decryptData({
          encryptedData: estimatedTotal,
          securityKey: securityKeyEstimated,
        }),
      );
    }

    const isEntry = transaction.movementType === MOVEMENT_TYPE.ENTRY;
    const isExitOrInvestment =
      transaction.movementType === MOVEMENT_TYPE.EXIT ||
      transaction.movementType === MOVEMENT_TYPE.INVESTMENT;

    if (isEntry || isExitOrInvestment) {
      const price = transaction.percentage
        ? (Number(transaction.price) * transaction.percentage) / 100
        : Number(transaction.price);

      const priceAdjustment = isEntry ? price : -price;

      if (transaction.status === STATUS.PAID) {
        totalAccount = totalAccount.toString()
          ? totalAccount + priceAdjustment
          : 0;
      } else {
        estimatedTotalAccount = estimatedTotalAccount.toString()
          ? estimatedTotalAccount + priceAdjustment
          : 0;
      }
    }

    return { total: totalAccount, estimatedTotal: estimatedTotalAccount };
  }

  private async createTransactions(
    transaction: CreateTransactions,
  ): Promise<TransactionsDTO> {
    const result =
      await this.transactionsRepository.createTransactions(transaction);

    return result;
  }

  private async updateTransaction(id: string, transaction: CreateTransactions) {
    await this.transactionsRepository.updateTransaction(id, transaction);
  }

  private async updateFutureTransaction(
    transactionId: string,
    transaction: CreateTransactions,
  ) {
    await this.transactionsRepository.updateFutureTransaction(
      transactionId,
      transaction,
    );
  }

  private async saveTransactions(
    transaction: CreateTransactions,
    user: UserJWT,
    id?: string,
  ): Promise<void> {
    const account = await this.getAccount(user.id);
    const calculateTransactions = await this.calculateTransactions(
      account,
      transaction,
    );

    const encryptPriceTransactions = await this.encryptionData(
      transaction.price.toString(),
    );

    transaction.accountId = account.id;
    transaction.userId = user.id;
    transaction.price = encryptPriceTransactions.encryptedData;
    transaction.securityKey = encryptPriceTransactions.securityKey;

    if (id) {
      const lastTransaction = await this.getTransaction(id);

      let price = Number(
        await this.decryptData({
          encryptedData: lastTransaction.price,
          securityKey: lastTransaction.securityKey,
        }),
      );

      await this.updateAccount({
        accountId: account.id,
        estimatedTotal:
          transaction.status === STATUS.PENDENT
            ? calculateTransactions.estimatedTotal - price
            : calculateTransactions.estimatedTotal,
        total:
          transaction.status === STATUS.PAID
            ? calculateTransactions.total - price
            : calculateTransactions.total,
      });

      await this.updateTransaction(id, transaction);

      if (lastTransaction.transactionId) {
        await this.updateFutureTransaction(id, transaction);
      }
    } else {
      await this.updateAccount({
        accountId: account.id,
        estimatedTotal: calculateTransactions.estimatedTotal,
        total: calculateTransactions.total,
      });

      transaction.date = new Date(transaction.date);
      transaction.date = add(transaction.date, { hours: 3 });

      const result = await this.createTransactions(transaction);
      const baseDate = new Date(transaction.date);

      if (transaction.isFixed) {
        transaction.transactionId = result.id;

        Array.from({ length: 30 }).forEach(async (_, index) => {
          const newDate = addMonths(baseDate, index + 1);

          await this.updateAccount({
            accountId: account.id,
            estimatedTotal:
              calculateTransactions.estimatedTotal + Number(transaction.price),
            total: calculateTransactions.total,
          });

          await this.createTransactions({
            ...transaction,
            date: newDate,
            status: STATUS.PENDENT,
          });
        });
      }
    }
  }

  async execute(
    transaction: CreateTransactionsDto,
    user: UserJWT,
    id?: string,
  ): Promise<void> {
    await this.saveTransactions(transaction, user, id);
  }
}
