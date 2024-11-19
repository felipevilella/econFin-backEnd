import {
  PROVIDER_SOCIAL_LOGIN,
  TYPE_USER,
} from "src/infra/entities/users.entity";
import { UserDto } from "../module/users/dto/user.dto";

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  image?: string;
  externalId?: string;
  provider: PROVIDER_SOCIAL_LOGIN;
  type: TYPE_USER;
  salt: string;
}

export interface IUsersRepository {
  createUser(user: CreateUser): Promise<UserDto>;
  getUserByEmail(email: string): Promise<UserDto>;
}
