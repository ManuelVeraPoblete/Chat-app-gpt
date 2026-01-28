// src/domain/users/usecases/GetUserProfileUseCase.ts
import type { UserProfile } from '../entities/UserProfile';
import type { UsersRepository } from '../repositories/UsersRepository';

/**
 * Caso de uso: obtener perfil público de un usuario por ID.
 * - Mantiene la lógica fuera de la UI.
 */
export class GetUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<UserProfile> {
    return this.usersRepository.getById(userId);
  }
}
