import type { AppUser } from '../entities/AppUser';

/**
 * Contrato de dominio para obtener usuarios.
 * DIP: Home depende de esta interfaz, no del HTTP directo.
 */
export type UsersRepository = {
  getAll(): Promise<AppUser[]>;
};
