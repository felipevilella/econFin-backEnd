import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../entities/users.entity";
import { Repository } from "typeorm";

import { UserDto } from "src/module/users/dto/user.dto";
import {
  CreateUser,
  IUsersRepository,
} from "src/repositories/users.repository.interface";

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getUserByEmail(email: string): Promise<UserDto> {
    return await this.userRepository.findOneBy({ email });
  }

  async getUserDivision(userId: string): Promise<UserDto> {
    return await this.userRepository.findOneBy({ userId: userId });
  }

  async createUser(user: CreateUser): Promise<UserDto> {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to create user");
    }
  }
}
