// src/domain/chat/ChatRepositoryHttp.ts

import { ENV } from '../../core/config/env';
import { HttpClient } from '../../core/http/HttpClient';

import type { ChatRepository } from './repositories/ChatRepository';
import type {
  ChatHistory,
  SendChatMessagePayload,
  SendMessageResult,
} from './entities/ChatMessage';

/**
 * ✅ ChatRepositoryHttp
 *
 * Implementación HTTP del repositorio de Chat.
 * Compatible con el HttpClient actual (headers tipados como string).
 * Solución profesional al error:
 * ❌ Type '{ "Content-Type": string }' is not assignable to type 'string'
 *
 * 👉 NO se pasan headers como objeto.
 * 👉 El HttpClient detecta FormData y setea headers internamente.
 */
export class ChatRepositoryHttp implements ChatRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * ✅ Obtener historial de mensajes
   * GET /chat/:peerId/messages
   */
  async getMessages(peerId: string, limit = 200): Promise<ChatHistory> {
    const path = `${ENV.CHAT_PATH}/${peerId}/messages?limit=${limit}`;
    return this.http.request<ChatHistory>(path, 'GET');
  }

  /**
   * ✅ Enviar mensaje simple (texto)
   */
  async sendMessage(peerId: string, text: string): Promise<SendMessageResult>;

  /**
   * ✅ Enviar mensaje PRO (texto + adjuntos + ubicación)
   */
  async sendMessage(
    peerId: string,
    payload: SendChatMessagePayload,
  ): Promise<SendMessageResult>;

  async sendMessage(
    peerId: string,
    input: string | SendChatMessagePayload,
  ): Promise<SendMessageResult> {
    const path = `${ENV.CHAT_PATH}/${peerId}/messages`;

    // ==============================
    // ✅ TEXTO SIMPLE (JSON)
    // ==============================
    if (typeof input === 'string') {
      return this.http.request<SendMessageResult, { text: string }>(
        path,
        'POST',
        { text: input },
      );
    }

    // ==============================
    // ✅ MENSAJE PRO (multipart/form-data)
    // ==============================
    const formData = new FormData();

    if (input.text) {
      formData.append('text', input.text);
    }

    if (input.location) {
      formData.append('location', JSON.stringify(input.location));
    }

    if (input.attachments?.length) {
      for (const file of input.attachments) {
        formData.append('files', file as any);
      }
    }

    /**
     * 🚨 IMPORTANTE
     * NO se setea 'Content-Type' manualmente.
     *
     * - fetch / axios lo calculan automáticamente
     * - evita errores de boundary
     * - evita el error de tipado que tienes ahora
     */
    return this.http.request<SendMessageResult>(
      path,
      'POST',
      formData,
    );
  }

  /**
   * ✅ Obtener conteo de mensajes NO LEÍDOS por peer
   *
   * POST /chat/unread-counts
   *
   * Body:
   * { peerIds: string[] }
   */
  async getUnreadCounts(peerIds: string[]): Promise<Record<string, number>> {
    const path = `${ENV.CHAT_PATH}/unread-counts`;

    const payload = {
      peerIds: Array.from(new Set(peerIds)).filter(Boolean),
    };

    const response = await this.http.request<
      { counts: Record<string, number> },
      typeof payload
    >(path, 'POST', payload);

    return response?.counts ?? {};
  }
}
