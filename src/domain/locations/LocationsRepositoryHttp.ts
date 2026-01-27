import type { HttpClient } from '../../core/http/HttpClient';
import { ENV } from '../../core/config/env';

import type {
  ActiveUserLocation,
  StopSharingResult,
  UpdateMyLocationPayload,
} from './entities/UserLocation';
import type { LocationsRepository } from './repositories/LocationsRepository';

/**
 * ✅ Implementación HTTP del repositorio de ubicaciones
 *
 * Clean Architecture:
 * - UI -> UseCases -> Repository(interface)
 * - Infra: RepositoryHttp -> HttpClient
 */
export class LocationsRepositoryHttp implements LocationsRepository {
  constructor(private readonly http: HttpClient) {}

  async getActiveLocations(maxAgeSeconds: number = 120): Promise<ActiveUserLocation[]> {
    const path = `${ENV.LOCATIONS_PATH}/active?maxAgeSeconds=${maxAgeSeconds}`;
    return this.http.request<ActiveUserLocation[]>(path, 'GET');
  }

  async updateMyLocation(payload: UpdateMyLocationPayload): Promise<ActiveUserLocation> {
    const path = `${ENV.LOCATIONS_PATH}/me`;
    return this.http.request<ActiveUserLocation, UpdateMyLocationPayload>(path, 'POST', payload);
  }

  async stopSharing(): Promise<StopSharingResult> {
    const path = `${ENV.LOCATIONS_PATH}/me`;
    return this.http.request<StopSharingResult>(path, 'DELETE');
  }
}
