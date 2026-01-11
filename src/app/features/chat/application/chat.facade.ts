import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// import { ChatMessage, ChatRole } from '../domain/chat-message.model';
import { ChatMessage, ChatRole } from '../domain/chat-message.model';


@Injectable({ providedIn: 'root' })
export class ChatFacade {

  /**
   * Subject interno (encapsulado).
   * Usamos BehaviorSubject para tener el último estado disponible.
   */
  private readonly messagesSubject = new BehaviorSubject<ChatMessage[]>([]);

  /**
   * Stream público SOLO lectura.
   */
  readonly messages$: Observable<ChatMessage[]> = this.messagesSubject.asObservable();

  /**
   * Agrega un mensaje de usuario.
   */
  addUserMessage(content: string): void {
    this.addMessage('USER', content);
  }

  /**
   * Agrega un mensaje del asistente/IA.
   */
  addAssistantMessage(content: string): void {
    this.addMessage('ASSISTANT', content);
  }

  /**
   * Limpia el chat.
   */
  clear(): void {
    this.messagesSubject.next([]);
  }

  /**
   * (Opcional) Semilla inicial.
   */
  loadInitialMessages(): void {
    // Ejemplo: cargar desde memoria local/servicio/API en el futuro
    // Por ahora lo dejamos vacío para no imponer lógica.
  }

  /**
   * Método centralizado para agregar mensajes.
   */
  private addMessage(role: ChatRole, content: string): void {
    const current = this.messagesSubject.value;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(), // ✅ moderno y simple
      role,
      content,
      createdAt: new Date(),
    };

    this.messagesSubject.next([...current, newMessage]);
  }
}
