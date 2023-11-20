import { User } from "./user";

export class AuthResponse {
  token!: string;
  message!: string;
  email!: string;
  user!: User;
}
