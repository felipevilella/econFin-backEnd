import Pbkdf2Helper from "module/infra/helpers/pbkdf2.helper";
import { AuthenticateUser, UserDto } from "../../dto/user.dto";
import { UsersRepository } from "../../repository/users.repository";
import { UnauthorizedException } from "@nestjs/common";

import { sign } from "jsonwebtoken";

export interface IResponseAuthenticateUser {
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  private async validatePassword(
    password: string,
    storageHash: string,
    salt: string,
  ): Promise<void> {
    const argon2Helper = new Pbkdf2Helper();
    const hasValidatePassword = await argon2Helper.validatePassword(
      password,
      storageHash,
      salt,
    );

    if (!hasValidatePassword) {
      throw new UnauthorizedException(
        "Invalid email or password. Please check your credentials and try again.",
      );
    }
  }

  private async generateToken(user: UserDto): Promise<string> {
    const payload = {
      user_id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    return token;
  }

  async execute(data: AuthenticateUser): Promise<IResponseAuthenticateUser> {
    const user = await this.usersRepository.getUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException(
        "Invalid email or password. Please check your credentials and try again.",
      );
    }

    await this.validatePassword(data.password, user.password, user.salt);

    const token = await this.generateToken(user);

    return { token: token };
  }
}
