import type { User } from '../../domain/auth/entities/Users';

export type Session = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  session: Session | null;
  isBootstrapping: boolean;
};

export type AuthActions = {
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
};
