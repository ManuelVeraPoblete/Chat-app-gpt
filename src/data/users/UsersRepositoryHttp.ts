// src/data/users/UsersRepositoryHttp.ts
import { ENV } from '../../core/config/env';
import type { HttpClient } from '../../core/http/HttpClient';
import type { AppUser } from '../../domain/users/entities/AppUser';
import type { UserProfile } from '../../domain/users/entities/UserProfile';
import type { UsersRepository } from '../../domain/users/repositories/UsersRepository';

/**
 * Implementación HTTP del repositorio de usuarios.
 * - Usa HttpClient (que en runtime es AuthorizedHttpClient) para incluir JWT automáticamente.
 */
export class UsersRepositoryHttp implements UsersRepository {
  constructor(private readonly http: HttpClient) {}

  async getAll(): Promise<AppUser[]> {
    // GET /users -> [{ id, email, displayName, ... }]
    return this.http.request<AppUser[]>(ENV.USERS_PATH, 'GET');
  }

  async getById(userId: string): Promise<UserProfile> {
    // GET /users/:id -> { id, email, displayName, phone, companySection, jobTitle, ... }
    return this.http.request<UserProfile>(`${ENV.USERS_PATH}/${userId}`, 'GET');
  }
}
