import {
  PROVIDER_SOCIAL_LOGIN,
  TYPE_USER,
} from "src/infra/entities/users.entity";
import { UserDto } from "../module/users/dto/user.dto";
import {
  METHOD_TYPE,
  MOVEMENT_TYPE,
  STATUS,
  TYPE,
} from "src/infra/entities/transactions.entity";

export interface CreateTransactions {
  name: string;
  price: string;
  status: STATUS;
  securityKey: string;
  movementType: MOVEMENT_TYPE;
  methodType: METHOD_TYPE;
  type: TYPE;
  date: Date;
  userId?: string;
  accountId?: string;
  cardId?: string;
}

export interface TransactionsDTO {
  id: string;
  name: string;
  price: string;
  securityKey: string;
  status: STATUS;
  movementType: MOVEMENT_TYPE;
  methodType: METHOD_TYPE;
  type: TYPE;
  date: Date;
  userId: string;
  percentage: number;
  cardId: string;
  userDivision?: UserDto;
}

export interface ITransactionsRepository {
  createTransactions(transaction: CreateTransactions): Promise<void>;
  updateTransaction(id: string, transaction: CreateTransactions): Promise<void>;
  getTransactionsByUserId(userId: string): Promise<TransactionsDTO[]>;
  getTransactionsById(id: string): Promise<TransactionsDTO>;
}
