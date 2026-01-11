// src/app/core/utils/storage.util.ts
/**
 * StorageUtil
 * ----------
 * Acceso seguro a localStorage.
 * - En Browser: usa localStorage normalmente.
 * - En SSR/Node: NO existe localStorage -> devuelve null / no-op.
 *
 * Esto evita warnings tipo:
 *  "Warning: --localstorage-file was provided without a valid path"
 */
export class StorageUtil {
  private static isBrowser(): boolean {
    // En SSR `window` no existe.
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  static getString(key: string): string | null {
    if (!this.isBrowser()) {
      // SSR: no leer storage
      return null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static setString(key: string, value: string): void {
    if (!this.isBrowser()) {
      // SSR: no escribir storage
      return;
    }

    try {
      window.localStorage.setItem(key, value);
    } catch {
      // no-op
    }
  }

  static remove(key: string): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch {
      // no-op
    }
  }
}
