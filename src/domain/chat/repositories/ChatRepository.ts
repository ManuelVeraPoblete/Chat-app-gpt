import type { ChatHistory, SendChatMessagePayload, SendMessageResult } from '../entities/ChatMessage';

/**
 * ✅ Contrato del repositorio de chat.
 *
 * Clean Architecture:
 * - La UI depende SOLO de esta interfaz (no sabe de HTTP ni FormData).
 * - La infraestructura (HTTP) implementa este contrato.
 */
export interface ChatRepository {
  /**
   * ✅ Obtiene historial entre el usuario logueado y el peer seleccionado.
   */
  getMessages(peerId: string, limit?: number): Promise<ChatHistory>;

  /**
   * ✅ Obtiene conteo de mensajes no-leídos por peer (Home)
   * Devuelve un map { [peerId]: count }
   */
  getUnreadCounts(peerIds: string[]): Promise<Record<string, number>>;

  /**
   * ✅ Enviar mensaje (compatibilidad + versión PRO)
   *
   * 📌 Compatibilidad:
   * - Aún aceptamos `text: string` para no romper flujo actual.
   *
   * ✅ Versión PRO:
   * - Acepta un payload con:
   *   - text
   *   - attachments (archivos)
   *   - location (ubicación WhatsApp-like)
   */
  sendMessage(peerId: string, text: string): Promise<SendMessageResult>;
  sendMessage(peerId: string, payload: SendChatMessagePayload): Promise<SendMessageResult>;
}
