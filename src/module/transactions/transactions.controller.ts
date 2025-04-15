import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";

import { RequestDTO } from "../auth/dto/auth.dto";
import { CreateTransactionsDto } from "./dto/transaction.dto";

import { UseCaseProxy } from "src/infra/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { FindTransactionsService } from "./services/findTransactions.service";
import { CreateOrUpdateTransactionService } from "./services/createOrUpdateTransactions.service";
import { GetMonthlyTransactionsService } from "./services/getMonthlyTransactions.service";

@Controller("transaction")
export class TransactionsController {
  constructor(
    @Inject(UseCaseProxyModule.CREATE_OR_UPDATE_TRANSACTIONS_SERVICE)
    private readonly CreateOrUpdateTransactionService: UseCaseProxy<CreateOrUpdateTransactionService>,
    @Inject(UseCaseProxyModule.FIND_TRANSACTIONS_SERVICE)
    private readonly findTransactionsService: UseCaseProxy<FindTransactionsService>,
    @Inject(UseCaseProxyModule.GET_MONTHLY_TRANSACTIONS)
    private readonly getMonthlyTransactionsService: UseCaseProxy<GetMonthlyTransactionsService>,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createTransactions: CreateTransactionsDto,
    @Request() request: RequestDTO,
  ) {
    const { user } = request;

    return await this.CreateOrUpdateTransactionService.getInstance().execute(
      createTransactions,
      user,
    );
  }

  @UseGuards(AuthGuard)
  @Put(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param("id") id: string,
    @Body() createTransactions: CreateTransactionsDto,
    @Request() request: RequestDTO,
  ) {
    const { user } = request;

    return await this.CreateOrUpdateTransactionService.getInstance().execute(
      createTransactions,
      user,
      id,
    );
  }

  @UseGuards(AuthGuard)
  @Get("/get-monthly-transactions")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMonthlyTransactions(
    @Query("date") date: string,
    @Request() request: RequestDTO,
  ) {
    const { user } = request;

    return await this.getMonthlyTransactionsService
      .getInstance()
      .execute(user, new Date(date));
  }

  @UseGuards(AuthGuard)
  @Get("/list")
  @UsePipes(new ValidationPipe({ transform: true }))
  async listTransactions(@Request() request: RequestDTO) {
    const { user } = request;

    return await this.findTransactionsService.getInstance().execute(user);
  }
}
