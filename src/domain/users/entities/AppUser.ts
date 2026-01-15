/**
 * Entidad de dominio: Usuario básico para listar chats.
 * No depende de React Native ni de HTTP (Clean Architecture).
 */
export type AppUser = {
  id: string;
  email: string;
  displayName: string;

  /**
   * Opcional si tu backend devuelve foto.
   */
  avatarUrl?: string | null;
};
