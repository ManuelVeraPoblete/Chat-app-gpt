/**
 * ✅ Entidad de dominio: mensaje de chat.
 *
 * Importante:
 * - Refleja exactamente lo que entrega el backend NestJS.
 * - createdAt llega como ISO string (en UI lo convertimos a Date).
 */
export type ChatRole = 'user' | 'assistant';

/**
 * ✅ Tipos de adjunto persistido (viene desde el backend)
 * - IMAGE / FILE => archivos reales
 * - LOCATION => ubicación compartida (tipo WhatsApp)
 */
export type ChatAttachmentKind = 'IMAGE' | 'FILE' | 'LOCATION';

/**
 * ✅ Attachment persistido en BD (backend -> frontend)
 *
 * Para cumplir Clean Code:
 * - Usamos unión discriminada por `kind`
 * - Evitamos campos "que no aplican" según el tipo
 */

/** ✅ Archivos: imágenes o documentos */
export type ChatFileAttachment = {
  id: string;
  kind: 'IMAGE' | 'FILE';

  /**
   * ✅ URL pública del archivo
   * - relativo (ej: /uploads/chat/xxx.jpg)
   * - o absoluto si backend lo entrega así
   */
  url: string;

  fileName: string;
  mimeType: string;
  fileSize: number;

  // ✅ opcional: metadata de imagen si existe
  width?: number | null;
  height?: number | null;
};

/** ✅ Ubicación compartida */
export type ChatLocationAttachment = {
  id: string;
  kind: 'LOCATION';

  latitude: number;
  longitude: number;

  /**
   * ✅ etiqueta opcional (ej: "Oficina", "Casa")
   */
  label?: string | null;
};

/**
 * ✅ Unión discriminada
 */
export type ChatAttachment = ChatFileAttachment | ChatLocationAttachment;

/**
 * ✅ Mensaje del chat (backend -> frontend)
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
 * ✅ Tipos para ENVÍO (frontend -> backend)
 * =============================================================================
 * Clean Architecture:
 * - El dominio NO conoce Express/Multer.
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
 * ✅ Ubicación saliente (WhatsApp-like)
 * No es un "archivo", pero es un adjunto de negocio.
 */
export type OutgoingLocation = {
  latitude: number;
  longitude: number;
  label?: string;
};

/**
 * ✅ Payload de envío de mensaje
 * Permite:
 * - solo texto
 * - solo adjuntos (archivos)
 * - texto + adjuntos
 * - ✅ ubicación como adjunto tipado (LOCATION)
 */
export type SendChatMessagePayload = {
  text?: string;
  attachments?: OutgoingAttachment[];

  /**
   * ✅ NUEVO: Ubicación como adjunto de negocio
   * (Luego backend lo persistirá como attachment kind=LOCATION)
   */
  location?: OutgoingLocation;
};
