/**
 * Entidad de dominio: mensaje de chat.
 *
 * ✅ Refleja exactamente lo que entrega el backend NestJS.
 * - role: 'user' | 'assistant'
 * - createdAt: string ISO (se convierte a Date en UI)
 */
export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  role: ChatRole;
  text: string;
  createdAt: string;
};

/**
 * Respuesta del endpoint GET /chat/:peerId/messages
 */
export type ChatHistory = {
  conversationId: string | null;
  messages: ChatMessage[];
};

/**
 * Respuesta del endpoint POST /chat/:peerId/messages
 */
export type SendMessageResult = {
  created: ChatMessage[];
};
