import type { ChatHistory, SendMessageResult } from '../entities/ChatMessage';

/**
 * Contrato del repositorio de chat.
 *
 * ✅ La capa de presentación (UI) depende solo de esta interfaz,
 * no de HTTP ni de detalles de infraestructura.
 */
export interface ChatRepository {
  /**
   * Obtiene historial entre el usuario logueado y el peer seleccionado.
   */
  getMessages(peerId: string, limit?: number): Promise<ChatHistory>;

  /**
   * Envía un mensaje al peer.
   * El backend devuelve los mensajes creados (usuario + opcional assistant).
   */
  sendMessage(peerId: string, text: string): Promise<SendMessageResult>;
}
