import {
  PROVIDER_SOCIAL_LOGIN,
  TYPE_USER,
} from "module/infra/entities/users.entity";
import { IResultUser } from "../dto/user.dto";

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  image?: string;
  externalId?: string;
  provider: PROVIDER_SOCIAL_LOGIN;
  type: TYPE_USER;
}

export interface IUsersRepository {
  create(user: CreateUser): Promise<IResultUser>;
}
