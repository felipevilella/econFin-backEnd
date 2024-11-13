import Pbkdf2Helper, {
  IHashPassword,
} from "module/infra/helpers/pbkdf2.helper";
import { CreateUserDto, UserDto } from "../../dto/user.dto";
import { UsersRepository } from "../../repository/users.repository";
import { BadRequestException } from "@nestjs/common";

export class CreateUserUseCases {
  constructor(private usersRepository: UsersRepository) {}

  private async encryptPassword(password: string): Promise<IHashPassword> {
    const argon2Helper = new Pbkdf2Helper();
    return await argon2Helper.hashPassword(password);
  }

  private async createUser(user: CreateUserDto) {
    const encrypt = await this.encryptPassword(user.password);
    const hasUser = await this.usersRepository.getUserByEmail(user.email);

    if (hasUser) {
      throw new BadRequestException(
        "The email address is already in use. Please use a different one.",
      );
    }
    user.password = encrypt.hash;
    user.salt = encrypt.salt;

    return this.usersRepository.createUser(user);
  }

  async execute(user: CreateUserDto): Promise<UserDto> {
    return await this.createUser(user);
  }
}
