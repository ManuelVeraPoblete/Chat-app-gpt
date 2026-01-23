import type { ChatHistory, SendChatMessagePayload, SendMessageResult } from '../entities/ChatMessage';

/**
 * ✅ Contrato de repositorio de Chat
 *
 * Principios aplicados:
 * - DIP: la UI depende de esta interfaz, no de HTTP
 * - SRP: el repositorio solo sabe "obtener/enviar mensajes", sin lógica de UI
 */
export interface ChatRepository {
  /**
   * ✅ Obtiene mensajes con el peerId (usuario con el que estoy chateando)
   * Se recomienda newest-first para FlatList inverted
   */
  getMessages(peerId: string, limit?: number): Promise<ChatHistory>;

  /**
   * ✅ Envía mensaje con texto y/o adjuntos
   */
  sendMessage(peerId: string, payload: SendChatMessagePayload): Promise<SendMessageResult>;
}
