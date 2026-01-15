import type { User } from '../entities/Users';

/**
 * Resultado real del endpoint POST /auth/login
 */
export type LoginResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

/**
 * Resultado esperado del refresh (típico):
 * - accessToken nuevo
 * - refreshToken opcional (si tu backend rota tokens)
 */
export type RefreshResult = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthRepository = {
  login(email: string, password: string): Promise<LoginResult>;

  /**
   * Refresca tokens usando refreshToken.
   */
  refresh(refreshToken: string): Promise<RefreshResult>;
};
