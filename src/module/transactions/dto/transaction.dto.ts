import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import {
  METHOD_TYPE,
  MOVEMENT_TYPE,
  STATUS,
  TYPE,
} from "src/infra/entities/transactions.entity";

export interface CreateTransactions {
  name: string;
  price: string;
  securityKey: string;
  status: STATUS;
  movementType: MOVEMENT_TYPE;
  methodType: METHOD_TYPE;
  type: TYPE;
  date: Date;
  userDivisionId?: string;
  userId?: string;
  accountId?: string;
  cardId?: string;
  percentage?: number;
}

export class CreateTransactionsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: "Password must be at least 4 characters long",
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: string;

  @IsNotEmpty()
  @IsEnum(MOVEMENT_TYPE, {
    message: "Provider must be one of the following: ENTRY, EXIT, INVESTMENT",
  })
  movementType: MOVEMENT_TYPE;

  @IsNotEmpty()
  @IsEnum(STATUS, {
    message: `Provider must be one of the following: ${Object.values(STATUS).join(", ")}`,
  })
  status: STATUS;

  @IsNotEmpty()
  @IsEnum(METHOD_TYPE, {
    message: `Provider must be one of the following: ${Object.values(METHOD_TYPE).join(", ")}`,
  })
  methodType: METHOD_TYPE;

  @IsNotEmpty()
  @IsEnum(TYPE, {
    message: `Provider must be one of the following: ${Object.values(TYPE).join(", ")}`,
  })
  type: TYPE;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsString()
  creditCardId: string;

  @IsOptional()
  @IsString()
  userDivisionId: string;

  @IsOptional()
  @IsString()
  securityKey: string;

  @IsOptional()
  @IsNumber()
  percentage: number;
}
