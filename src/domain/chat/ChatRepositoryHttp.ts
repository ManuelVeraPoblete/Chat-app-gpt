import { ENV } from '../../core/config/env';
import type { HttpClient } from '../../core/http/HttpClient';
import type { ChatHistory, SendMessageResult } from '../../domain/chat/entities/ChatMessage';
import type { ChatRepository } from '../../domain/chat/repositories/ChatRepository';

/**
 * Implementación HTTP del repositorio de chat.
 *
 * ✅ Usa el HttpClient autorizado (ApiContext) por lo que:
 * - agrega Authorization automáticamente
 * - refresca token si recibe 401
 */
export class ChatRepositoryHttp implements ChatRepository {
  constructor(private readonly http: HttpClient) {}

  async getMessages(peerId: string, limit: number = 200): Promise<ChatHistory> {
    // GET /chat/:peerId/messages?limit=200
    const path = `${ENV.CHAT_PATH}/${peerId}/messages?limit=${limit}`;
    return this.http.request<ChatHistory>(path, 'GET');
  }

  async sendMessage(peerId: string, text: string): Promise<SendMessageResult> {
    // POST /chat/:peerId/messages
    const path = `${ENV.CHAT_PATH}/${peerId}/messages`;

    return this.http.request<SendMessageResult, { text: string }>(path, 'POST', {
      text,
    });
  }
}
