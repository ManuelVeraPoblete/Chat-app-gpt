/**
 * ✅ formatBytes
 * Convierte bytes a un string legible.
 *
 * Ejemplos:
 * - 512 => "512 B"
 * - 2048 => "2.00 KB"
 * - 1048576 => "1.00 MB"
 */
export function formatBytes(bytes: number | undefined | null): string {
  const value = bytes ?? 0;
  if (value <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;

  const i = Math.min(Math.floor(Math.log(value) / Math.log(k)), units.length - 1);
  const num = value / Math.pow(k, i);

  // ✅ B sin decimales, el resto con 2 decimales
  const fixed = i === 0 ? num.toFixed(0) : num.toFixed(2);

  return `${fixed} ${units[i]}`;
}
