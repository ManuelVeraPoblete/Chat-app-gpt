import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * ✅ useFocusPolling<T>
 *
 * Polling "inteligente" que solo corre cuando la pantalla está enfocada (visible).
 * Ideal para chats, notificaciones, refresh de listas, etc.
 *
 * Beneficios:
 * - Evita gastar batería/red cuando la pantalla NO está activa
 * - Evita memory leaks al desmontar
 * - Evita llamadas concurrentes si el backend tarda
 */
type UseFocusPollingParams<T> = {
  enabled: boolean;
  intervalMs: number;

  /**
   * Función que trae data desde API (ej: GET messages)
   */
  fetcher: () => Promise<T>;

  /**
   * Handler cuando llega data correctamente
   */
  onData: (data: T) => void;

  /**
   * Handler opcional para errores
   */
  onError?: (error: unknown) => void;
};

export function useFocusPolling<T>({
  enabled,
  intervalMs,
  fetcher,
  onData,
  onError,
}: UseFocusPollingParams<T>) {
  const isRunningRef = useRef(false);

  const tick = useCallback(async () => {
    // ✅ Evita ticks simultáneos (si la red está lenta)
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    try {
      const data = await fetcher();
      onData(data);
    } catch (e) {
      onError?.(e);
    } finally {
      isRunningRef.current = false;
    }
  }, [fetcher, onData, onError]);

  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;

      let cancelled = false;
      let timer: ReturnType<typeof setInterval> | null = null;

      const safeTick = async () => {
        if (cancelled) return;
        await tick();
      };

      // ✅ Ejecuta una vez al entrar al foco
      void safeTick();

      // ✅ Luego cada X ms
      timer = setInterval(() => void safeTick(), intervalMs);

      return () => {
        cancelled = true;
        if (timer) clearInterval(timer);
      };
    }, [enabled, intervalMs, tick])
  );
}
