import { instanceToInstance } from "class-transformer";
import {
  METHOD_TYPE,
  MOVEMENT_TYPE,
  STATUS,
  TYPE,
} from "src/infra/entities/transactions.entity";
import { TransactionsDTO } from "src/repositories/transactions.repository.interface";

export interface ITransactionsMapDTO {
  id: string;
  name: string;
  price: number;
  status: STATUS;
  movementType: MOVEMENT_TYPE;
  methodType: METHOD_TYPE;
  type: TYPE;
  percentage?: number;
  divisionName?: string;
  userDivisionId?: string;
  divisionValue?: number;
  date: Date;
}

class TransactionsMap {
  static toDTO({
    name,
    date,
    id,
    methodType,
    movementType,
    price,
    status,
    percentage,
    userDivision,
    userDivisionId,
    type,
  }: TransactionsDTO): ITransactionsMapDTO {
    const transaction = instanceToInstance({
      id,
      name,
      date,
      methodType,
      movementType,
      price: Number(price),
      status,
      divisionName: userDivision?.name,
      divisionValue: percentage ? (percentage * Number(price)) / 100 : 0,
      userDivisionId,
      percentage,
      type,
    });

    return transaction;
  }
}

export { TransactionsMap };
