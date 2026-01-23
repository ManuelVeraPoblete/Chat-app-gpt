import { getApiBaseUrl } from '../../shared/config/apiBaseUrl';

/**
 * ✅ ENV (Configuración de entorno)
 *
 * Objetivo:
 * - Centralizar endpoints y configuración
 * - Evitar hardcodear `localhost` (en Android físico SIEMPRE falla)
 *
 * Cómo se resuelve la URL base:
 * 1) `EXPO_PUBLIC_API_URL` desde `.env` (RECOMENDADO)
 * 2) `extra.API_BASE_URL` desde app.config / app.json
 * 3) Detección automática por Expo (hostUri)
 * 4) Fallbacks por plataforma
 */
export const ENV = {
  /**
   * ✅ URL base de la API
   * Ejemplo en Android físico: http://192.168.1.28:3000
   */
  API_BASE_URL: getApiBaseUrl(),

  /**
   * ✅ Refresh tokens
   */
  AUTH_REFRESH_PATH: '/auth/refresh',

  /**
   * ✅ Endpoint para traer usuarios desde la BD
   */
  USERS_PATH: '/users',

  /**
   * ✅ Base path del módulo de chat
   * - GET  /chat/:peerId/messages?limit=200
   * - POST /chat/:peerId/messages
   */
  CHAT_PATH: '/chat',

  /**
   * ✅ Archivos públicos (servidos por el backend)
   * Ej:
   * - /uploads/chat/<file>
   */
  UPLOADS_PATH: '/uploads',
} as const;
