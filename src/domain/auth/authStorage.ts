import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from './types';

const KEY = '@corpchat/session';

/**
 * Storage aislado (SRP). Fácil de testear y reemplazar.
 */
export const authStorage = {
  async saveSession(session: Session): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(session));
  },

  async getSession(): Promise<Session | null> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  },
};
