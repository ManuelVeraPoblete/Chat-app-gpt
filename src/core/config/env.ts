import { Platform } from 'react-native';

/**
 * Configuración centralizada del entorno.
 * ✅ Android Emulator: localhost del PC = 10.0.2.2
 * ✅ iOS Simulator: localhost funciona normal
 * ✅ Dispositivo físico: usar IP real de tu PC (ej: 192.168.1.10)
 */
export const ENV = {
  API_BASE_URL:
    Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000',

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
};
