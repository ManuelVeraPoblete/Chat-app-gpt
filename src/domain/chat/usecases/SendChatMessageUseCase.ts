import type { SendMessageResult } from '../entities/ChatMessage';
import type { ChatRepository } from '../repositories/ChatRepository';

/**
 * Caso de uso: enviar un mensaje.
 */
export class SendChatMessageUseCase {
  constructor(private readonly repo: ChatRepository) {}

  async execute(peerId: string, text: string): Promise<SendMessageResult> {
    const safeText = (text ?? '').trim();
    if (!safeText) {
      return { created: [] };
    }

    return this.repo.sendMessage(peerId, safeText);
  }
}
