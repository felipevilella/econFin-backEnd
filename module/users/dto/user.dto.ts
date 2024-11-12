import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import {
  PROVIDER_SOCIAL_LOGIN,
  TYPE_USER,
} from "module/infra/entities/users.entity";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  image?: string;
  provider: PROVIDER_SOCIAL_LOGIN;
  type: TYPE_USER;
}

export interface IResultUser {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  isActive: boolean;
  externalId?: string;
  provider: PROVIDER_SOCIAL_LOGIN;
  type: TYPE_USER;
  createdDate: Date;
  updatedDate: Date;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: "Password must be at least 8 characters long",
  })
  password: string;

  @IsNotEmpty()
  @IsEnum(PROVIDER_SOCIAL_LOGIN, {
    message:
      "Provider must be one of the following: PLATFORM, GOOGLE, FACEBOOK",
  })
  provider: PROVIDER_SOCIAL_LOGIN;

  @IsNotEmpty()
  @IsEnum(TYPE_USER, {
    message: "Type must be either PRINCIPAL or SECONDARY",
  })
  type: TYPE_USER;
}
