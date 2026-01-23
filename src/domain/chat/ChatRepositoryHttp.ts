import { ENV } from '../../core/config/env';
import type { HttpClient } from '../../core/http/HttpClient';
import type {
  ChatHistory,
  SendChatMessagePayload,
  SendMessageResult,
} from '../../domain/chat/entities/ChatMessage';
import type { ChatRepository } from '../../domain/chat/repositories/ChatRepository';

/**
 * ✅ Implementación HTTP del repositorio de chat.
 *
 * Reglas:
 * - GET mensajes (historial)
 * - POST enviar mensaje:
 *    - JSON si es solo texto
 *    - FormData si hay adjuntos
 */
export class ChatRepositoryHttp implements ChatRepository {
  private static readonly MAX_FILES = 10;

  constructor(private readonly http: HttpClient) {}

  async getMessages(peerId: string, limit: number = 200): Promise<ChatHistory> {
    const path = `${ENV.CHAT_PATH}/${peerId}/messages?limit=${limit}`;
    return this.http.request<ChatHistory>(path, 'GET');
  }

  async sendMessage(peerId: string, payload: SendChatMessagePayload): Promise<SendMessageResult> {
    const path = `${ENV.CHAT_PATH}/${peerId}/messages`;

    const safeText = (payload?.text ?? '').trim();
    const attachments = payload?.attachments ?? [];

    // ✅ Guard: máximo WhatsApp-like
    if (attachments.length > ChatRepositoryHttp.MAX_FILES) {
      throw new Error(`Máximo permitido: ${ChatRepositoryHttp.MAX_FILES} archivos por mensaje.`);
    }

    // ✅ Si hay adjuntos => multipart SIEMPRE
    if (attachments.length > 0) {
      const form = new FormData();

      if (safeText.length > 0) {
        form.append('text', safeText);
      }

      for (const f of attachments) {
        form.append(
          'files',
          {
            uri: f.uri,
            name: f.name,
            type: f.mimeType,
          } as any,
        );
      }

      return this.http.request<SendMessageResult, FormData>(path, 'POST', form);
    }

    // ✅ Solo texto => JSON
    return this.http.request<SendMessageResult, { text: string }>(path, 'POST', {
      text: safeText,
    });
  }
}
