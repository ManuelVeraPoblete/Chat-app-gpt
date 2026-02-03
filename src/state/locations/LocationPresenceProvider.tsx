// src/state/locations/LocationPresenceProvider.tsx

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Location from 'expo-location';

import { useApi } from '../api/ApiContext';
import { useAuth } from '../auth/AuthContext';

import { LocationsRepositoryHttp } from '../../domain/locations/LocationsRepositoryHttp';
import { UpdateMyLocationUseCase } from '../../domain/locations/usecases/UpdateMyLocationUseCase';

/**
 * ✅ LocationPresenceProvider (FRONT)
 * Mantiene la ubicación "fresca" en backend para que el usuario aparezca en:
 * GET /locations/active (por updatedAt reciente).
 *
 * - Corre solo si hay sesión y la app está en foreground.
 * - Envía cada 15s (maxAgeSeconds backend = 120).
 * - No usa background location (más simple + menos fricción).
 */
export function LocationPresenceProvider({ children }: { children: React.ReactNode }) {
  const { http } = useApi();
  const { session, isBootstrapping } = useAuth();

  const isLoggedIn = Boolean(session?.accessToken);

  const updateMyLocationUseCase = useMemo(() => {
    const repo = new LocationsRepositoryHttp(http);
    return new UpdateMyLocationUseCase(repo);
  }, [http]);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runningRef = useRef(false);

  const lastSentAtRef = useRef<number>(0);
  const SEND_EVERY_MS = 15_000;

  const stop = useCallback(() => {
    runningRef.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const sendOnce = useCallback(async () => {
    if (!isLoggedIn) return;

    // ✅ throttle
    const now = Date.now();
    if (now - lastSentAtRef.current < SEND_EVERY_MS - 1_000) return;

    // ✅ permiso foreground
    const perm = await Location.getForegroundPermissionsAsync();
    if (perm.status !== 'granted') {
      const req = await Location.requestForegroundPermissionsAsync();
      if (req.status !== 'granted') return;
    }

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    await updateMyLocationUseCase.execute({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy ?? undefined,
      isLive: false,
    });

    lastSentAtRef.current = now;
  }, [isLoggedIn, updateMyLocationUseCase]);

  const start = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    await sendOnce();

    timerRef.current = setInterval(() => {
      void sendOnce();
    }, SEND_EVERY_MS);
  }, [sendOnce]);

  // ✅ arranque/parada por sesión
  useEffect(() => {
    if (isBootstrapping) return;

    if (!isLoggedIn) {
      stop();
      return;
    }

    if (appStateRef.current === 'active') {
      void start();
    }

    return () => stop();
  }, [isBootstrapping, isLoggedIn, start, stop]);

  // ✅ pausa en background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      if (prev !== 'active' && next === 'active') {
        if (!isBootstrapping && isLoggedIn) void start();
      }

      if (prev === 'active' && next !== 'active') {
        stop();
      }
    });

    return () => sub.remove();
  }, [isBootstrapping, isLoggedIn, start, stop]);

  return <>{children}</>;
}
