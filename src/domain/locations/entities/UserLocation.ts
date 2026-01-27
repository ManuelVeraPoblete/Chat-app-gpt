/**
 * ✅ Entidades de dominio para Geolocalización
 *
 * Importante:
 * - El dominio no conoce HTTP ni Expo.
 * - Solo define datos y contratos.
 */

export type ActiveUserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;

  isLive: boolean;
  liveUntil: string | null; // ISO string

  updatedAt: string | null; // ISO string
};

export type UpdateMyLocationPayload = {
  latitude: number;
  longitude: number;
  accuracy?: number;

  /**
   * ✅ Modo WhatsApp-like:
   * - isLive=false => ubicación puntual (solo “conectado”)
   * - isLive=true  => ubicación en tiempo real por N minutos
   */
  isLive?: boolean;
  liveMinutes?: number;
};

export type StopSharingResult = {
  ok: boolean;
};
