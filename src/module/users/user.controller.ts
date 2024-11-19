import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { CreateUserDto } from "./dto/user.dto";
import { UseCaseProxy } from "src/infra/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { CreateUserService } from "./services/create-user.service";

@Controller("users")
export class UserController {
  constructor(
    @Inject(UseCaseProxyModule.CREATE_USER_SERVICE)
    private readonly createUserUseCase: UseCaseProxy<CreateUserService>,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserUseCase.getInstance().execute(createUserDto);
  }
}
