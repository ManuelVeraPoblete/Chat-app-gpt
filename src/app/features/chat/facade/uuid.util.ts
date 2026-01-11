// src/app/features/chat/facade/uuid.util.ts
/**
 * UUID v4 simple (no criptográfico).
 * Suficiente para IDs de UI. Evita dependencias extra.
 */
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
