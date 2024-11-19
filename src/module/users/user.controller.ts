import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { CreateUserDto } from "./dto/user.dto";
import { UseCaseProxy } from "src/infra/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { AuthGuard } from "../auth/auth.guard";
import { CreateUserService } from "./services/create-user.service";
import { CreateFinancialDivisionService } from "./services/create-financial-division.service";
import { RequestDTO } from "../auth/dto/auth.dto";

@Controller("users")
export class UserController {
  constructor(
    @Inject(UseCaseProxyModule.CREATE_USER_SERVICE)
    private readonly createUserService: UseCaseProxy<CreateUserService>,
    @Inject(UseCaseProxyModule.CREATE_FINANCIAL_DIVISION_SERVICE)
    private readonly createFinancialDivisionService: UseCaseProxy<CreateFinancialDivisionService>,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserService.getInstance().execute(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Post("/financial-division")
  @UsePipes(new ValidationPipe({ transform: true }))
  async financialDivision(
    @Body() createUserDto: CreateUserDto,
    @Request() request: RequestDTO,
  ) {
    const { user } = request;

    return await this.createFinancialDivisionService
      .getInstance()
      .execute(createUserDto, user);
  }
}
