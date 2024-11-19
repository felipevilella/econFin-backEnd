export interface UserJWT {
  id: string;
  name: string;
  email: string;
}

export interface RequestDTO {
  user: UserJWT;
}
