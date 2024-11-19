import { instanceToInstance } from "class-transformer";
import { PROVIDER_SOCIAL_LOGIN } from "src/infra/entities/users.entity";
import { UserDto } from "../dto/user.dto";

interface IUserMapDTO {
  id: string;
  email: string;
  name: string;
  provider: PROVIDER_SOCIAL_LOGIN;
  image?: string;
}

class UserMap {
  static toDTO({ id, email, name, provider, image }: UserDto): IUserMapDTO {
    const user = instanceToInstance({
      id,
      email,
      name,
      image,
      provider,
    });

    return user;
  }
}

export { UserMap };
