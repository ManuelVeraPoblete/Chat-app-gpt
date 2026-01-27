import type { StopSharingResult } from '../entities/UserLocation';
import type { LocationsRepository } from '../repositories/LocationsRepository';

/**
 * ✅ Caso de uso: detener compartir ubicación
 */
export class StopSharingLocationUseCase {
  constructor(private readonly repo: LocationsRepository) {}

  async execute(): Promise<StopSharingResult> {
    return this.repo.stopSharing();
  }
}
