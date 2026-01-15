import type { AuthRepository, RefreshResult } from '../repositories/AuthRepository';

/**
 * Caso de uso para refrescar tokens.
 * Mantiene la regla fuera de la UI y fuera de la infraestructura.
 */
export class RefreshTokensUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(refreshToken: string): Promise<RefreshResult> {
    if (!refreshToken?.trim()) {
      throw new Error('refreshToken es requerido');
    }
    return this.authRepository.refresh(refreshToken.trim());
  }
}
