import {
  Controller,
  Get,
  Inject,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";

import { RequestDTO } from "../auth/dto/auth.dto";

import { UseCaseProxy } from "src/infra/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { getAccountService } from "./services/getAccount.services";

@Controller("account")
export class AccountsController {
  constructor(
    @Inject(UseCaseProxyModule.GET_ACCOUNT_SERVICE)
    private readonly getAccountService: UseCaseProxy<getAccountService>,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async listTransactions(@Request() request: RequestDTO) {
    const { user } = request;

    return await this.getAccountService.getInstance().execute(user);
  }
}
