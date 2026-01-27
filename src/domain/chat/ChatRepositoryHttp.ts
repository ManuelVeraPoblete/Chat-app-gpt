import { ENV } from '../../core/config/env';
import type { HttpClient } from '../../core/http/HttpClient';

import type {
  ChatHistory,
  SendChatMessagePayload,
  SendMessageResult,
} from '../../domain/chat/entities/ChatMessage';
import type { ChatRepository } from '../../domain/chat/repositories/ChatRepository';

/**
 * Implementación HTTP del repositorio de chat.
 *
 * ✅ Usa el HttpClient autorizado (ApiContext) por lo que:
 * - agrega Authorization automáticamente
 * - refresca token si recibe 401
 *
 * ✅ Soporta:
 * - Texto (JSON)
 * - Ubicación (JSON o multipart)
 * - Archivos/Imágenes (multipart/form-data)
 */
export class ChatRepositoryHttp implements ChatRepository {
  constructor(private readonly http: HttpClient) {}

  async getMessages(peerId: string, limit: number = 200): Promise<ChatHistory> {
    // GET /chat/:peerId/messages?limit=200
    const path = `${ENV.CHAT_PATH}/${peerId}/messages?limit=${limit}`;
    return this.http.request<ChatHistory>(path, 'GET');
  }

  /**
   * ✅ Overloads (Clean Architecture)
   * - Mantiene compatibilidad con la versión antigua (texto)
   * - Agrega soporte PRO: payload (texto + adjuntos + ubicación)
   */
  async sendMessage(peerId: string, text: string): Promise<SendMessageResult>;
  async sendMessage(peerId: string, payload: SendChatMessagePayload): Promise<SendMessageResult>;
  async sendMessage(
    peerId: string,
    input: string | SendChatMessagePayload,
  ): Promise<SendMessageResult> {
    const path = `${ENV.CHAT_PATH}/${peerId}/messages`;

    // ✅ Compatibilidad: sendMessage(peerId, "hola")
    if (typeof input === 'string') {
      const safeText = input.trim();
      if (!safeText) return { created: [] };

      return this.http.request<SendMessageResult, { text: string }>(path, 'POST', {
        text: safeText,
      });
    }

    // ✅ Nuevo formato PRO: sendMessage(peerId, { text, attachments, location })
    const safeText = (input.text ?? '').trim();
    const hasFiles = (input.attachments?.length ?? 0) > 0;
    const hasLocation = Boolean(input.location);

    // ✅ No enviamos requests vacíos
    if (!safeText && !hasFiles && !hasLocation) {
      return { created: [] };
    }

    /**
     * ✅ Caso 1: Sin archivos => JSON
     * (ideal para ubicación + texto)
     */
    if (!hasFiles) {
      return this.http.request<SendMessageResult, { text: string; location?: any }>(path, 'POST', {
        text: safeText,
        location: input.location,
      });
    }

    /**
     * ✅ Caso 2: Con archivos => multipart/form-data
     * Campo esperado en backend: "files"
     *
     * 📌 Importante:
     * - En multipart, los campos llegan como string (por eso location va como JSON string).
     */
    const form = new FormData();

    // ✅ Texto es opcional (puede ser adjuntos-only)
    form.append('text', safeText);

    // ✅ Ubicación (si viene) como JSON string
    if (input.location) {
      form.append('location', JSON.stringify(input.location));
    }

    // ✅ Archivos/Imágenes
    for (const att of input.attachments ?? []) {
      form.append(
        'files',
        {
          uri: att.uri,
          name: att.name,
          type: att.mimeType,
        } as any,
      );
    }

    /**
     * ✅ IMPORTANTE:
     * NO mandamos Content-Type manual en multipart.
     * El boundary lo genera fetch automáticamente.
     * (En el siguiente archivo ajustaremos el HttpClient para soportar FormData)
     */
    return this.http.request<SendMessageResult, any>(path, 'POST', form as any, {});
  }
}
