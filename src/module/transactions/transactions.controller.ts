import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
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

@Controller("transaction")
export class TransactionsController {
  constructor(
    @Inject(UseCaseProxyModule.CREATE_OR_UPDATE_TRANSACTIONS_SERVICE)
    private readonly CreateOrUpdateTransactionService: UseCaseProxy<CreateOrUpdateTransactionService>,
    @Inject(UseCaseProxyModule.FIND_TRANSACTIONS_SERVICE)
    private readonly findTransactionsService: UseCaseProxy<FindTransactionsService>,
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
  @Get("/list")
  @UsePipes(new ValidationPipe({ transform: true }))
  async listTransactions(@Request() request: RequestDTO) {
    const { user } = request;

    return await this.findTransactionsService.getInstance().execute(user);
  }
}
