import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  AuthService,
  IResponseAuthenticateUser,
} from "./services/auth.service";

import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { UseCaseProxy } from "src/infra/usecase-proxy/usecase-proxy";
import { AuthenticateUser } from "../users/dto/user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(UseCaseProxyModule.AUTHENTICATE_USER_SERVICE)
    private authService: UseCaseProxy<AuthService>,
  ) {}

  @Post("signIn")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(
    @Body() authenticateUser: AuthenticateUser,
  ): Promise<IResponseAuthenticateUser> {
    return this.authService.getInstance().execute(authenticateUser);
  }
}
