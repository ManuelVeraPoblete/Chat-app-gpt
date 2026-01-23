/**
 * ✅ Entidad de dominio: mensaje de chat.
 *
 * Importante:
 * - Refleja exactamente lo que entrega el backend NestJS.
 * - createdAt llega como ISO string (en UI lo convertimos a Date).
 */
export type ChatRole = 'user' | 'assistant';

/**
 * ✅ Tipo de adjunto persistido (viene desde el backend)
 */
export type ChatAttachmentKind = 'IMAGE' | 'FILE';

/**
 * ✅ Attachment persistido en BD (backend -> frontend)
 * url: será relativo (ej: /uploads/chat/xxx.jpg) o absoluto según backend
 */
export type ChatAttachment = {
  id: string;
  kind: ChatAttachmentKind;
  url: string;

  fileName: string;
  mimeType: string;
  fileSize: number;

  // ✅ opcional: por si a futuro el backend agrega metadata de imagen
  width?: number | null;
  height?: number | null;
};

/**
 * ✅ Mensaje del chat (backend -> frontend)
 *
 * attachments:
 * - puede venir vacío o no venir dependiendo del backend (por eso ?)
 * - cuando no hay archivos, el backend manda [] pero lo soportamos igual
 */
export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  role: ChatRole;

  /**
   * ✅ Texto del mensaje
   * Puede venir "" si el mensaje fue "solo adjuntos"
   */
  text: string;

  /**
   * ✅ Adjuntos (opcional)
   */
  attachments?: ChatAttachment[];

  createdAt: string;
};

/**
 * ✅ Respuesta del endpoint GET /chat/:peerId/messages
 */
export type ChatHistory = {
  conversationId: string | null;
  messages: ChatMessage[];
};

/**
 * ✅ Respuesta del endpoint POST /chat/:peerId/messages
 */
export type SendMessageResult = {
  created: ChatMessage[];
};

/**
 * =============================================================================
 * ✅ Tipos para ENVÍO de archivos (frontend -> backend)
 * =============================================================================
 *
 * Estos tipos NO dependen de Express/Multer.
 * (Cumple Clean Architecture: el dominio no conoce infraestructura)
 */

/**
 * ✅ Archivo local seleccionado desde Expo ImagePicker / DocumentPicker
 */
export type OutgoingAttachment = {
  /**
   * URI local del archivo (file:// o content://)
   */
  uri: string;

  /**
   * Nombre del archivo (ej: documento.pdf)
   */
  name: string;

  /**
   * MIME type (ej: image/jpeg, application/pdf)
   */
  mimeType: string;

  /**
   * Tamaño en bytes (opcional dependiendo del picker)
   */
  size?: number;

  /**
   * Para UI (preview) y validaciones locales
   */
  kind: 'image' | 'file';
};

/**
 * ✅ Payload de envío de mensaje
 * Permite:
 * - solo texto
 * - solo adjuntos
 * - texto + adjuntos
 */
export type SendChatMessagePayload = {
  text?: string;
  attachments?: OutgoingAttachment[];
};
