import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Inject,
} from "@nestjs/common";

import { CreateUserUseCase } from "../usecase/createUser.usecase";
import { CreateUserDto } from "../dto/user.dto";

@Controller("users")
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserUseCase.execute(createUserDto);
  }
}
