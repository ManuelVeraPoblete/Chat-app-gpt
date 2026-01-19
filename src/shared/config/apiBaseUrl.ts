import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

/**
 * ✅ getApiBaseUrl()
 * Devuelve la URL base correcta según el entorno:
 * - Android Emulator  -> 10.0.2.2
 * - iOS Simulator     -> localhost
 * - Dispositivo físico-> IP del PC (si Expo entrega hostUri)
 */
export function getApiBaseUrl(): string {
  // ✅ 1) Override opcional por config extra (si quieres dejarlo fijo)
  const extra: any =
    (Constants.expoConfig?.extra as any) ??
    (Constants.manifest as any)?.extra ??
    {};

  if (extra?.API_BASE_URL) {
    return String(extra.API_BASE_URL);
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
