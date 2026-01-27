import { getApiBaseUrl } from '../../shared/config/apiBaseUrl';

/**
 * ✅ ENV (Configuración de entorno)
 *
 * Objetivo:
 * - Centralizar endpoints y configuración
 * - Evitar hardcodear `localhost` (en Android físico SIEMPRE falla)
 */
export const ENV = {
  /**
   * ✅ URL base de la API
   * Ejemplo en Android físico: http://192.168.1.28:3000
   */
  API_BASE_URL: getApiBaseUrl(),

  /**
   * ✅ Auth
   */
  AUTH_REFRESH_PATH: '/auth/refresh',

  /**
   * ✅ Usuarios
   */
  USERS_PATH: '/users',

  /**
   * ✅ Chat
   */
  CHAT_PATH: '/chat',

  /**
   * ✅ Ubicaciones (geolocalización)
   * - POST   /locations/me
   * - DELETE /locations/me
   * - GET    /locations/active
   */
  LOCATIONS_PATH: '/locations',

  /**
   * ✅ Archivos públicos
   */
  UPLOADS_PATH: '/uploads',
} as const;
