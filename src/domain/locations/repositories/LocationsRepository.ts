import type {
  ActiveUserLocation,
  StopSharingResult,
  UpdateMyLocationPayload,
} from '../entities/UserLocation';

/**
 * ✅ LocationsRepository
 *
 * SRP:
 * - Solo conoce operaciones de geolocalización (sin lógica UI).
 * DIP:
 * - La capa de dominio depende de esta interfaz, no de HTTP.
 */
export interface LocationsRepository {
  /**
   * ✅ Lista usuarios conectados con ubicación reciente.
   * maxAgeSeconds: por defecto 120s (2 minutos)
   */
  getActiveLocations(maxAgeSeconds?: number): Promise<ActiveUserLocation[]>;

  /**
   * ✅ Actualiza mi ubicación (puntual o live)
   */
  updateMyLocation(payload: UpdateMyLocationPayload): Promise<ActiveUserLocation>;

  /**
   * ✅ Detener compartir ubicación
   */
  stopSharing(): Promise<StopSharingResult>;
}
