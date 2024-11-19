import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import Pbkdf2Helper from "src/infra/helpers/pbkdf2.helper";
import { UsersRepository } from "src/infra/repositories/users.repository";

import { AuthenticateUser, UserDto } from "src/module/users/dto/user.dto";

export interface IResponseAuthenticateUser {
  token: string;
}

@Injectable()
export class AuthService {
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
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const jwtService = new JwtService();

    const token = await jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY,
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
