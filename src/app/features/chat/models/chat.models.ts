export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number; // epoch ms
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  conversationId: string | null;
  model: string;
  answer: string;
}
