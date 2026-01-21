import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

/**
 * ✅ getApiBaseUrl()
 * Devuelve la URL base correcta según el entorno:
 * - Android Emulator  -> 10.0.2.2
 * - iOS Simulator     -> localhost
 * - Dispositivo físico-> IP del PC (recomendado: usar EXPO_PUBLIC_API_URL en .env)
 */
export function getApiBaseUrl(): string {
  // ✅ 0) Override por variable de entorno (la forma más confiable para Android físico)
  // En el root del proyecto crea un `.env` con:
  // EXPO_PUBLIC_API_URL=http://192.168.1.28:3000
  // (Expo expone estas vars en runtime automáticamente)
  const envUrl = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();
  if (envUrl) return normalizeBaseUrl(envUrl);

  // ✅ 1) Override opcional por config extra (si quieres dejarlo fijo)
  const extra: any =
    (Constants.expoConfig?.extra as any) ??
    (Constants.manifest as any)?.extra ??
    {};

  if (extra?.API_BASE_URL) {
    return normalizeBaseUrl(String(extra.API_BASE_URL));
  }

  // ✅ 2) Intentar detectar IP del PC desde Expo (hostUri)
  const hostUri =
    (Constants.expoConfig as any)?.hostUri ??
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri ??
    (Constants.manifest as any)?.hostUri;

  const lanIp = hostUri ? String(hostUri).split(':')[0] : null;

  // ✅ 3) Reglas por plataforma / entorno
  if (Platform.OS === 'android') {
    // Android Emulator
    if (!Device.isDevice) return 'http://10.0.2.2:3000';

    // Android físico (si podemos inferir IP del PC)
    if (lanIp) return `http://${lanIp}:3000`;

    // Fallback
    return 'http://10.0.2.2:3000';
  }

  // iOS
  if (Platform.OS === 'ios') {
    // iOS Simulator
    if (!Device.isDevice) return 'http://localhost:3000';

    // iPhone físico (si podemos inferir IP del PC)
    if (lanIp) return `http://${lanIp}:3000`;

    // Fallback
    return 'http://localhost:3000';
  }

  // Otros (web, etc.)
  return 'http://localhost:3000';
}

/**
 * ✅ Normaliza la base URL para evitar errores típicos:
 * - asegura http/https
 * - elimina slash final
 */
function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim();

  // Si el usuario puso solo "192.168.1.28:3000", agregamos http://
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;

  // Quitamos slash final para que `${baseUrl}${path}` no duplique
  return withProtocol.replace(/\/$/, '');
}
