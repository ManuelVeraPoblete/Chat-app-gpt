import type { AppUser } from '../entities/AppUser';
import type { UsersRepository } from '../repositories/UsersRepository';

/**
 * Caso de uso: obtener lista de usuarios para el Home.
 * Mantiene lógica fuera de la UI.
 */
export class GetUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(): Promise<AppUser[]> {
    return this.usersRepository.getAll();
  }
}
