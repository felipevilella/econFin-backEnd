import { CreateUserDto, IResponseUserDto, UserDto } from "../dto/user.dto";
import { UsersRepository } from "../../../infra/repositories/users.repository";
import { BadRequestException } from "@nestjs/common";
import Pbkdf2Helper, { IHashPassword } from "src/infra/helpers/pbkdf2.helper";
import { UserMap } from "../mapper/user.mapper";
import { AccountRepository } from "src/infra/repositories/accounts.repository";
import Encryption, { EncryptedData } from "src/infra/helpers/encryption.helper";

export class CreateUserService {
  constructor(
    private usersRepository: UsersRepository,
    private accountRepository: AccountRepository,
  ) {}

  private async encryptPassword(password: string): Promise<IHashPassword> {
    const argon2Helper = new Pbkdf2Helper();
    return await argon2Helper.hashPassword(password);
  }

  private async encryptionData(data: string): Promise<EncryptedData> {
    const encryption = new Encryption();

    return await encryption.encrypt(data);
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

    const createUser = await this.usersRepository.createUser(user);
    const encryption = await this.encryptionData("0");

    await this.accountRepository.createAccount({
      total: encryption.encryptedData,
      securityKey: encryption.securityKey,
      userId: createUser.id,
    });

    return createUser;
  }

  async execute(user: CreateUserDto): Promise<IResponseUserDto> {
    const result = await this.createUser(user);

    return UserMap.toDTO(result);
  }
}
