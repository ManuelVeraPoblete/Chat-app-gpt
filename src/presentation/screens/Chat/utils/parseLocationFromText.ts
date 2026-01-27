/**
 * ✅ parseLocationFromText
 * Detecta si un texto contiene una ubicación en formato Google Maps:
 * - https://www.google.com/maps?q=LAT,LNG
 *
 * Retorna coords y url para renderizar una tarjeta estilo WhatsApp.
 */
export type ParsedLocation = {
  latitude: number;
  longitude: number;
  mapsUrl: string;
};

export function parseLocationFromText(text?: string | null): ParsedLocation | null {
  if (!text) return null;

  // ✅ Ej: https://www.google.com/maps?q=-33.45,-70.66
  const regex = /https?:\/\/www\.google\.com\/maps\?q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i;
  const match = text.match(regex);

  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

  return {
    latitude,
    longitude,
    mapsUrl: match[0],
  };
}

/**
 * ✅ cleanLocationText
 * Limpia el texto de ubicación para no mostrar la URL completa en el chat.
 */
export function cleanLocationText(original: string): string {
  // ✅ Remueve el link de Google Maps si viene incluido
  return original.replace(/https?:\/\/www\.google\.com\/maps\?q=[^\s]+/gi, '').trim();
}
