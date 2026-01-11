import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../core/api/tokens';
import { ChatRequest } from '../models/chat.models';

// SRP: este servicio se encarga SOLO del streaming.
@Injectable({ providedIn: 'root' })
export class ChatStreamService {
  constructor(@Inject(API_BASE_URL) private readonly baseUrl: string) {}

  /**
   * Streaming por fetch: lee chunks y va emitiendo deltas mediante callbacks.
   * El backend envía SSE (event: delta, data: {"delta":"..."}) pero vía POST.
   */
  async streamMessage(
    req: ChatRequest,
    onDelta: (delta: string) => void,
    onMeta?: (meta: { conversationId: string | null; model: string }) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Stream HTTP error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse básico SSE:
      // event: delta\n
      // data: {"delta":"..."}\n\n
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        const lines = part.split('\n');
        const eventLine = lines.find(l => l.startsWith('event:'));
        const dataLine = lines.find(l => l.startsWith('data:'));

        const eventName = eventLine?.replace('event:', '').trim();
        const dataRaw = dataLine?.replace('data:', '').trim();

        if (!eventName || !dataRaw) continue;

        try {
          const payload = JSON.parse(dataRaw);

          if (eventName === 'meta') {
            onMeta?.({
              conversationId: payload.conversationId ?? null,
              model: payload.model ?? '',
            });
          }

          if (eventName === 'delta') {
            onDelta(payload.delta ?? '');
          }

          if (eventName === 'done') {
            // fin
            return;
          }
        } catch {
          // Si llega algo inesperado, lo ignoramos para robustez
        }
      }
    }
  }
}
 