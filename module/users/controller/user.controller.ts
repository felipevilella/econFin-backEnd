import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UseCaseProxyModule } from "module/infra/usecase-proxy/usecase-proxy.module";
import { CreateUserUseCases } from "../usecase/user/createUser.usecase";
import { AuthenticateUser, CreateUserDto } from "../dto/user.dto";
import { UseCaseProxy } from "module/infra/usecase-proxy/usecase-proxy";
import {
  AuthenticateUserUseCase,
  IResponseAuthenticateUser,
} from "../usecase/user/authenticateUser.usecase";

@Controller("users")
export class UserController {
  constructor(
    @Inject(UseCaseProxyModule.CREATE_USER_USE_CASE)
    private readonly createUserUseCase: UseCaseProxy<CreateUserUseCases>,
    @Inject(UseCaseProxyModule.AUTHENTICATE_USER_USE_CASE)
    private readonly authenticateUserUseCase: UseCaseProxy<AuthenticateUserUseCase>,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserUseCase.getInstance().execute(createUserDto);
  }

  @Post("/authenticate")
  @UsePipes(new ValidationPipe({ transform: true }))
  async authenticate(
    @Body() authenticateUser: AuthenticateUser,
  ): Promise<IResponseAuthenticateUser> {
    return await this.authenticateUserUseCase
      .getInstance()
      .execute(authenticateUser);
  }
}
