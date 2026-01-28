// src/domain/users/repositories/UsersRepository.ts
import type { AppUser } from '../entities/AppUser';
import type { UserProfile } from '../entities/UserProfile';

/**
 * Contrato de dominio para usuarios.
 * DIP: la UI depende de esta interfaz y de casos de uso, no de HTTP directo.
 */
export type UsersRepository = {
  /**
   * Lista usuarios para el Home (chat list).
   * Backend: GET /users
   */
  getAll(): Promise<AppUser[]>;

  /**
   * Obtiene el perfil público de un usuario.
   * Backend: GET /users/:id
   */
  getById(userId: string): Promise<UserProfile>;
};
