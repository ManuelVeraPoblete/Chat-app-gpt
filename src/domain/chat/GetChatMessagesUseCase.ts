
import type { ChatHistory } from '../chat/entities/ChatMessage';

import type { ChatRepository } from '../chat/repositories/ChatRepository';

/**
 * Caso de uso: obtener historial del chat.
 */
export class GetChatMessagesUseCase {
  constructor(private readonly repo: ChatRepository) {}

  async execute(peerId: string, limit: number = 200): Promise<ChatHistory> {
    return this.repo.getMessages(peerId, limit);
  }
}
