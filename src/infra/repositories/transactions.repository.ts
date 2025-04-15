import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/users.entity";
import { Repository } from "typeorm";

import { Transactions } from "../entities/transactions.entity";
import {
  CreateTransactions,
  ITransactionsRepository,
  TransactionsDTO,
} from "src/repositories/transactions.repository.interface";

@Injectable()
export class TransactionsRepository implements ITransactionsRepository {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactions: Repository<Transactions>,
  ) {}

  async getTransactionsByUserId(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TransactionsDTO[]> {
    const transactions = await this.transactions
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.userDivision", "userDivision")
      .where("transaction.userId = :userId", { userId })
      .andWhere("transaction.date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .getMany();

    return transactions;
  }
  async getTransactionsById(id: string): Promise<TransactionsDTO> {
    const transaction = await this.transactions
      .createQueryBuilder("transaction")
      .innerJoinAndSelect("transaction.userDivision", "user")
      .where("transaction.id = :id", { id })
      .getOne();

    return transaction;
  }
  async createTransactions(transaction: CreateTransactions): Promise<void> {
    try {
      const newTransaction = this.transactions.create(transaction);
      await this.transactions.save(newTransaction);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Transaction to create account");
    }
  }

  async updateTransaction(
    id: string,
    transaction: CreateTransactions,
  ): Promise<void> {
    try {
      await this.transactions.update({ id }, transaction);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to create account");
    }
  }
}
