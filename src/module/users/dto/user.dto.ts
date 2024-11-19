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
} from "src/infra/entities/users.entity";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  image?: string;
  provider: PROVIDER_SOCIAL_LOGIN;
  type: TYPE_USER;
  salt: string;
  userId?: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  isActive: boolean;
  externalId?: string;
  salt: string;
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
    message: "Type must be either PRINCIPAL or FINANCE_DIVISION",
  })
  type: TYPE_USER;
}

export class AuthenticateUser {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: "Password must be at least 8 characters long",
  })
  password: string;
}

export interface AuthenticateUserDto {
  name: string;
  email: string;
  password: string;
  image?: string;
  provider: PROVIDER_SOCIAL_LOGIN;
  type: TYPE_USER;
  salt: string;
}
