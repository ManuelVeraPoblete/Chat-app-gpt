import type { ActiveUserLocation } from '../entities/UserLocation';
import type { LocationsRepository } from '../repositories/LocationsRepository';

/**
 * ✅ Caso de uso: obtener usuarios activos con ubicación reciente
 */
export class GetActiveLocationsUseCase {
  constructor(private readonly repo: LocationsRepository) {}

  async execute(maxAgeSeconds: number = 120): Promise<ActiveUserLocation[]> {
    return this.repo.getActiveLocations(maxAgeSeconds);
  }
}
