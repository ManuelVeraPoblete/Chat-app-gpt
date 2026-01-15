import type { User } from '../../domain/auth/entities/Users';

/**
 * Sesión persistida en la app.
 */
export type Session = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
