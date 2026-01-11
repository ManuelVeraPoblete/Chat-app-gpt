import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChatApiService } from '../data-access/chat-api.service';
import { ChatStreamService } from '../data-access/chat-stream.service';
import { ChatMessage } from '../models/chat.models';
import { environment } from '../../../../environments/environment';
import { StorageUtil } from '../../../core/utils/storage.util';
import { firstValueFrom } from 'rxjs';
import { uuidv4 } from './uuid.util';

@Injectable({ providedIn: 'root' })
export class ChatFacade {
  private readonly STORAGE_KEY = 'chat.conversationId';

  private readonly _messages = signal<ChatMessage[]>([]);
  private readonly _loading = signal(false);
  private readonly _model = signal<string>('');
  private readonly _conversationId = signal<string | null>(null);

  readonly messages = computed(() => this._messages());
  readonly loading = computed(() => this._loading());
  readonly model = computed(() => this._model());
  readonly conversationId = computed(() => this._conversationId());

  private readonly isBrowser: boolean;

  constructor(
    private readonly api: ChatApiService,
    private readonly stream: ChatStreamService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // ✅ Cargar conversationId solo en browser
    if (this.isBrowser) {
      this._conversationId.set(StorageUtil.getString(this.STORAGE_KEY));
    }

    // Mensaje inicial
    this._messages.set([
      {
        id: uuidv4(),
        role: 'assistant',
        text: 'Hola 👋 Soy tu asistente. ¿En qué te ayudo hoy?',
        createdAt: Date.now(),
        status: 'sent',
      },
    ]);
  }

  async send(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: trimmed,
      createdAt: Date.now(),
      status: 'sent',
    };
    this._messages.update(m => [...m, userMsg]);

    const assistantId = uuidv4();
    this._messages.update(m => [
      ...m,
      {
        id: assistantId,
        role: 'assistant',
        text: '',
        createdAt: Date.now(),
        status: 'sending',
      },
    ]);

    this._loading.set(true);

    try {
      const conversationId = this._conversationId();

      if (environment.useStreaming) {
        await this.stream.streamMessage(
          { message: trimmed, conversationId: conversationId ?? undefined },
          (delta) => this.appendAssistantDelta(assistantId, delta),
          (meta) => {
            this._model.set(meta.model ?? '');
            this.persistConversationId(meta.conversationId);
          }
        );

        this.markAssistantSent(assistantId);
      } else {
        const res = await firstValueFrom(
          this.api.sendMessage({ message: trimmed, conversationId: conversationId ?? undefined })
        );

        this._model.set(res.model ?? '');
        this.persistConversationId(res.conversationId);

        this.setAssistantText(assistantId, res.answer ?? '');
        this.markAssistantSent(assistantId);
      }
    } catch (e) {
      console.error('[CHAT SEND ERROR]', e);
      this.markAssistantError(assistantId, 'Ocurrió un error al obtener respuesta 😕');
    } finally {
      this._loading.set(false);
    }
  }

  clearConversation(): void {
    if (this.isBrowser) {
      StorageUtil.remove(this.STORAGE_KEY);
    }
    this._conversationId.set(null);
    this._model.set('');
    this._messages.set([
      {
        id: uuidv4(),
        role: 'assistant',
        text: 'Conversación reiniciada ✅ ¿Qué necesitas ahora?',
        createdAt: Date.now(),
        status: 'sent',
      },
    ]);
  }

  private persistConversationId(conversationId: string | null): void {
    if (!conversationId) return;
    this._conversationId.set(conversationId);

    // ✅ Guardar solo en browser
    if (this.isBrowser) {
      StorageUtil.setString(this.STORAGE_KEY, conversationId);
    }
  }

  private appendAssistantDelta(id: string, delta: string): void {
    if (!delta) return;
    this._messages.update(list =>
      list.map(m => (m.id === id ? { ...m, text: m.text + delta } : m))
    );
  }

  private setAssistantText(id: string, text: string): void {
    this._messages.update(list =>
      list.map(m => (m.id === id ? { ...m, text } : m))
    );
  }

  private markAssistantSent(id: string): void {
    this._messages.update(list =>
      list.map(m => (m.id === id ? { ...m, status: 'sent' } : m))
    );
  }

  private markAssistantError(id: string, fallback: string): void {
    this._messages.update(list =>
      list.map(m =>
        m.id === id ? { ...m, status: 'error', text: m.text || fallback } : m
      )
    );
  }
}
