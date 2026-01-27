import type { ActiveUserLocation, UpdateMyLocationPayload } from '../entities/UserLocation';
import type { LocationsRepository } from '../repositories/LocationsRepository';

/**
 * ✅ Caso de uso: actualizar mi ubicación (puntual o live)
 */
export class UpdateMyLocationUseCase {
  constructor(private readonly repo: LocationsRepository) {}

  async execute(payload: UpdateMyLocationPayload): Promise<ActiveUserLocation> {
    // ✅ Validaciones de negocio básicas
    if (payload.latitude < -90 || payload.latitude > 90) {
      throw new Error('Latitude inválida (-90 a 90)');
    }
    if (payload.longitude < -180 || payload.longitude > 180) {
      throw new Error('Longitude inválida (-180 a 180)');
    }

    return this.repo.updateMyLocation(payload);
  }
}
