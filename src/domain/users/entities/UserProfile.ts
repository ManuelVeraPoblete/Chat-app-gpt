// src/domain/users/entities/UserProfile.ts
/**
 * Entidad de dominio: Perfil público de usuario.
 * - Representa lo que entrega el backend en GET /users/:id (sin datos sensibles).
 * - No depende de React Native ni de HTTP (Clean Architecture).
 */
export type UserProfile = {
  id: string;
  email: string;
  displayName: string;

  // ✅ Datos corporativos (opcionales)
  phone?: string | null;
  companySection?: string | null;
  jobTitle?: string | null;

  // ✅ Auditoría / estado (opcionales, por si el backend los expone)
  status?: 'ACTIVE' | 'INACTIVE' | string;
  createdAt?: string;
  updatedAt?: string;
};
