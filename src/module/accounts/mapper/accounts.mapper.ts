import { instanceToInstance } from "class-transformer";
import { AccountDto, IAccountMapper } from "../dto/accounts.dto";

class AccountMap {
  static toDTO({ id, total, estimatedTotal }: AccountDto): IAccountMapper {
    const transaction = instanceToInstance({
      total: Number(total),
      estimatedTotal: Number(estimatedTotal),
    });

    return transaction;
  }
}

export { AccountMap };
