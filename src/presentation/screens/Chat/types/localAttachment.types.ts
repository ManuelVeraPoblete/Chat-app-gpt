/**
 * ✅ LocalAttachment
 * Representa un archivo seleccionado en el dispositivo antes de enviar.
 * Se usa para:
 * - Preview en el composer
 * - Validaciones locales (tamaño, cantidad)
 */
export type LocalAttachmentKind = 'image' | 'file';

export type LocalAttachment = {
  id: string;
  kind: LocalAttachmentKind;

  /**
   * URI local: file://... o content://...
   */
  uri: string;

  /**
   * Nombre original del archivo
   */
  name: string;

  /**
   * MIME type (image/jpeg, application/pdf, etc.)
   */
  mimeType: string;

  /**
   * Tamaño del archivo en bytes (si el picker lo entrega)
   */
  size?: number;

  /**
   * Metadata opcional para imágenes
   */
  width?: number;
  height?: number;
};
