import type { AuthRepository, LoginResult } from '../repositories/AuthRepository';

/**
 * Caso de uso (application business rules):
 * - Orquesta la operación login
 * - Valida reglas simples
 * - No depende de React Native ni HTTP
 */
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    if (!email.trim()) throw new Error('Email es requerido');
    if (!password.trim()) throw new Error('Password es requerido');

    return this.authRepository.login(email.trim(), password);
  }
}
