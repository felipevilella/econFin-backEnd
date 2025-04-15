import Encryption, { EncryptedData } from "src/infra/helpers/encryption.helper";
import { TransactionsRepository } from "src/infra/repositories/transactions.repository";

import { UserJWT } from "src/module/auth/dto/auth.dto";
import { TransactionsDTO } from "src/repositories/transactions.repository.interface";
import {
  ITransactionsMapDTO,
  TransactionsMap,
} from "../mapper/transactions.mapper";

export class FindTransactionsService {
  constructor(private transactionsRepository: TransactionsRepository) {}

  private async decryptData(encryptedData: EncryptedData): Promise<string> {
    const encryption = new Encryption();

    return await encryption.decrypt(encryptedData);
  }

  private async getTransactions(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TransactionsDTO[]> {
    const transactions =
      await this.transactionsRepository.getTransactionsByUserId(
        userId,
        startDate,
        endDate,
      );

    return transactions;
  }

  private async FindTransactions(
    user: UserJWT,
    startDate: Date,
    endDate: Date,
  ): Promise<ITransactionsMapDTO[]> {
    const transactions = await this.getTransactions(
      user.id,
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

  async execute(user: UserJWT): Promise<ITransactionsMapDTO[]> {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);

    const transactions = await this.FindTransactions(user, startDate, endDate);

    return transactions;
  }
}
