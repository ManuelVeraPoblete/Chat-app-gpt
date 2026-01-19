/**
 * UserListItem
 * - Usuario que viene desde GET /users
 * - Incluye datos corporativos
 */
export type UserListItem = {
  id: string;
  email: string;
  displayName: string;

  avatarUrl?: string | null;

  phone?: string | null;
  companySection?: string | null;
  jobTitle?: string | null;
};
