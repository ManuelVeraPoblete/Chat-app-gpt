/**
 * Entidad de dominio: Usuario básico para listar chats.
 * No depende de React Native ni de HTTP (Clean Architecture).
 */
export type AppUser = {
  id: string;
  email: string;
  displayName: string;

  // opcional si lo usas en UI
  avatarUrl?: string | null;

  // ✅ NUEVO: datos corporativos
  phone?: string | null;
  companySection?: string | null;
  jobTitle?: string | null;
};

