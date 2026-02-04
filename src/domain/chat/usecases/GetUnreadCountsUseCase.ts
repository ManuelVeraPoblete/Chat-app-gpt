// src/domain/chat/usecases/GetUnreadCountsUseCase.ts

import type { ChatRepository } from '../repositories/ChatRepository';

/**
 * ✅ GetUnreadCountsUseCase
 *
 * Caso de uso de dominio:
 * - Obtiene la cantidad de mensajes NO LEÍDOS por usuario (peer)
 * - No conoce HTTP, rutas ni detalles de infraestructura
 *
 * Usado en:
 * - HomeScreen (lista de chats)
 *
 * Retorna:
 * {
 *   [peerId: string]: number
 * }
 */
export class GetUnreadCountsUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  /**
   * Ejecuta el caso de uso
   *
   * @param peerIds IDs de usuarios con los que se quiere conocer el conteo
   */
  async execute(peerIds: string[]): Promise<Record<string, number>> {
    if (!Array.isArray(peerIds) || peerIds.length === 0) {
      return {};
    }

    return this.chatRepository.getUnreadCounts(peerIds);
  }
}
