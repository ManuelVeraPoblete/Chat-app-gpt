import type { ChatHistory } from './entities/ChatMessage';
import type { ChatRepository } from './repositories/ChatRepository';

/**
 * ✅ Caso de uso: obtener historial del chat.
 *
 * Clean Architecture:
 * - El caso de uso NO sabe de HTTP, solo conoce el repositorio (DIP).
 */
export class GetChatMessagesUseCase {
  constructor(private readonly repo: ChatRepository) {}

  async execute(peerId: string, limit: number = 200): Promise<ChatHistory> {
    return this.repo.getMessages(peerId, limit);
  }
}
