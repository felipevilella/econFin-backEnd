import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../../infra/entities/users.entity";
import { Repository } from "typeorm";
import {
  CreateUser,
  IUsersRepository,
} from "module/users/repositories/users.repository.interface";
import { IResultUser } from "module/users/dto/user.dto";

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(user: CreateUser): Promise<IResultUser> {
    try {
      return this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to create user");
    }
  }
}
