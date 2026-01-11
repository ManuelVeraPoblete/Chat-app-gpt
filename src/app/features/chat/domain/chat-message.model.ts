/**
 * Roles permitidos dentro del chat.
 * Mantenerlo como union type simplifica validación y evita strings libres.
 */
export type ChatRole = 'USER' | 'ASSISTANT';

/**
 * Entidad de dominio: ChatMessage.
 * Esto NO depende de Angular (DDD / Clean Architecture friendly).
 */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
}
