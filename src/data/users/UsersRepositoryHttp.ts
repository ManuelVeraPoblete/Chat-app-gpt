import { ENV } from '../../core/config/env';
import type { HttpClient } from '../../core/http/HttpClient';
import type { AppUser } from '../../domain/users/entities/AppUser';
import type { UsersRepository } from '../../domain/users/repositories/UsersRepository';

/**
 * Implementación HTTP del repositorio de usuarios.
 */
export class UsersRepositoryHttp implements UsersRepository {
  constructor(private readonly http: HttpClient) {}

  async getAll(): Promise<AppUser[]> {
    // GET /users -> [{ id, email, displayName }]
    return this.http.request<AppUser[]>(ENV.USERS_PATH, 'GET');
  }
}
