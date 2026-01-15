import { ENV } from '../../core/config/env';
import type { HttpClient } from '../../core/http/HttpClient';
import type { AuthRepository, LoginResult, RefreshResult } from '../../domain/auth/repositories/AuthRepository';

/**
 * Implementación concreta del AuthRepository vía HTTP.
 */
export class AuthRepositoryHttp implements AuthRepository {
  constructor(private readonly http: HttpClient) {}

  async login(email: string, password: string): Promise<LoginResult> {
    // POST /auth/login => { user, accessToken, refreshToken }
    return this.http.request<LoginResult, { email: string; password: string }>(
      '/auth/login',
      'POST',
      { email, password }
    );
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    // POST /auth/refresh => { accessToken, refreshToken? }
    return this.http.request<RefreshResult, { refreshToken: string }>(
      ENV.AUTH_REFRESH_PATH,
      'POST',
      { refreshToken }
    );
  }
}
