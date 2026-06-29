export type UserRole = 'ADMIN' | 'USER';

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  role: UserRole;
}

export interface AuthSession {
  token: string;
  tokenType: string;
  expiresIn: number;
  role: UserRole;
  email: string;
}
