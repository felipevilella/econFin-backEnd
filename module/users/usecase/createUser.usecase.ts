import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto, IResultUser } from "../dto/user.dto";
import { UsersRepository } from "../repository/users.repository";
import { Users } from "module/infra/entities/users.entity";

export class CreateUserUseCase {
  constructor(
    @InjectRepository(Users)
    private usersRepository: UsersRepository,
  ) {}

  async execute(user: CreateUserDto): Promise<IResultUser> {
    return this.usersRepository.create(user);
  }
}
