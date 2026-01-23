import type { ChatRepository } from '../repositories/ChatRepository';
import type { SendChatMessagePayload, SendMessageResult } from '../entities/ChatMessage';

/**
 * ✅ Caso de Uso: Enviar mensaje (texto y/o adjuntos)
 *
 * Principios:
 * - SRP: este usecase valida y delega al repo
 * - Clean Code: reglas claras (no enviar vacío)
 */
export class SendChatMessageUseCase {
  constructor(private readonly repo: ChatRepository) {}

  async execute(peerId: string, payload: SendChatMessagePayload): Promise<SendMessageResult> {
    const safeText = (payload?.text ?? '').trim();
    const attachments = payload?.attachments ?? [];

    // ✅ No permitir enviar vacío
    const isEmpty = safeText.length === 0 && attachments.length === 0;
    if (isEmpty) {
      return { created: [] };
    }

    return this.repo.sendMessage(peerId, {
      text: safeText,
      attachments,
    });
  }
}
