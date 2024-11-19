import { CreateUserDto, UserDto } from "../dto/user.dto";
import { UsersRepository } from "../../../infra/repositories/users.repository";
import Pbkdf2Helper, { IHashPassword } from "src/infra/helpers/pbkdf2.helper";
import { UserJWT } from "src/module/auth/dto/auth.dto";
import { BadRequestException } from "@nestjs/common";

export class CreateFinancialDivisionService {
  constructor(private usersRepository: UsersRepository) {}

  private async encryptPassword(password: string): Promise<IHashPassword> {
    const argon2Helper = new Pbkdf2Helper();
    return await argon2Helper.hashPassword(password);
  }

  private async createUser(
    createUser: CreateUserDto,
    user: UserJWT,
  ): Promise<UserDto> {
    const encrypt = await this.encryptPassword(createUser.password);
    const hasUser = await this.usersRepository.getUserByEmail(createUser.email);

    if (hasUser) {
      throw new BadRequestException(
        "The email address is already in use. Please use a different one.",
      );
    }

    createUser.password = encrypt.hash;
    createUser.salt = encrypt.salt;
    createUser.userId = user.id;

    return this.usersRepository.createUser(createUser);
  }

  async execute(createUser: CreateUserDto, user: UserJWT): Promise<UserDto> {
    return await this.createUser(createUser, user);
  }
}
