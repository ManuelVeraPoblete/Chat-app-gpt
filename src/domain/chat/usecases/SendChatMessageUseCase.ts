import type { ChatRepository } from '../repositories/ChatRepository';
import type { SendChatMessagePayload, SendMessageResult } from '../entities/ChatMessage';

/**
 * ✅ SendChatMessageUseCase
 *
 * Clean Architecture:
 * - La UI llama este caso de uso.
 * - El caso de uso valida reglas y delega al repositorio.
 *
 * ✅ Soporta:
 * - texto
 * - archivos/imágenes (attachments)
 * - ubicación (location) como adjunto real tipo WhatsApp (LOCATION)
 */
export class SendChatMessageUseCase {
  constructor(private readonly repo: ChatRepository) {}

  /**
   * ✅ Compatibilidad: permite ejecutar con string (legacy)
   */
  async execute(peerId: string, text: string): Promise<SendMessageResult>;

  /**
   * ✅ Nuevo modo PRO: payload completo
   */
  async execute(peerId: string, payload: SendChatMessagePayload): Promise<SendMessageResult>;

  async execute(peerId: string, input: string | SendChatMessagePayload): Promise<SendMessageResult> {
    if (!peerId?.trim()) {
      throw new Error('peerId es requerido para enviar el mensaje');
    }

    // ✅ Modo legacy (solo texto)
    if (typeof input === 'string') {
      const text = input.trim();
      if (!text) return { created: [] };

      return this.repo.sendMessage(peerId, text);
    }

    // ✅ Modo PRO (texto + adjuntos + ubicación)
    const text = (input.text ?? '').trim();
    const hasFiles = (input.attachments?.length ?? 0) > 0;
    const hasLocation = Boolean(input.location);

    // ✅ Regla: no enviar vacío
    if (!text && !hasFiles && !hasLocation) {
      return { created: [] };
    }

    // ✅ Validación de ubicación (si viene)
    if (input.location) {
      const { latitude, longitude } = input.location;

      if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
        throw new Error('Ubicación inválida: lat/lng fuera de rango');
      }
    }

    return this.repo.sendMessage(peerId, {
      text,
      attachments: input.attachments,
      location: input.location,
    });
  }
}

/**
 * ✅ Helpers validación coordenadas
 */
function isValidLatitude(value: number): boolean {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: number): boolean {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}
