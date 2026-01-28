// src/presentation/screens/Locations/LocationsScreen.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { useApi } from '../../../state/api/ApiContext';
import { useAuth } from '../../../state/auth/AuthContext';

import { UsersRepositoryHttp } from '../../../data/users/UsersRepositoryHttp';
import { GetUsersUseCase } from '../../../domain/users/usecases/GetUsersUseCase';

import { LocationsRepositoryHttp } from '../../../domain/locations/LocationsRepositoryHttp';
import { GetActiveLocationsUseCase } from '../../../domain/locations/usecases/GetActiveLocationsUseCase';

import type { ActiveUserLocation } from '../../../domain/locations/entities/UserLocation';
import { useFocusPolling } from '../../../shared/hooks/useFocusPolling';

import { styles as s } from './LocationsScreen.styles';

type UserMini = {
  displayName: string;
  avatarUrl?: string | null;
};

/**
 * ✅ LocationsScreen
 * - Muestra la ubicación de todos los usuarios activos en el mapa (API).
 * - Muestra MI ubicación local (GPS) aunque yo no esté compartiendo.
 * - Marcadores:
 *    - Foto de perfil si existe
 *    - Si no existe: círculo con iniciales (como en chat)
 *
 * Nota: Footer de compartir ubicación fue removido.
 */
export function LocationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { http } = useApi();
  const { session } = useAuth();

  const myUserId = session?.user?.id ?? '';

  /**
   * ✅ DI (UseCases)
   */
  const usersUseCase = useMemo(() => {
    const repo = new UsersRepositoryHttp(http);
    return new GetUsersUseCase(repo);
  }, [http]);

  const locationsRepo = useMemo(() => new LocationsRepositoryHttp(http), [http]);
  const getActiveUseCase = useMemo(() => new GetActiveLocationsUseCase(locationsRepo), [locationsRepo]);

  /**
   * ✅ UI state
   */
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  const [activeLocations, setActiveLocations] = useState<ActiveUserLocation[]>([]);
  const [usersById, setUsersById] = useState<Record<string, UserMini>>({});

  const [hasLocationPerm, setHasLocationPerm] = useState<boolean>(false);
  const [myCoords, setMyCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  /**
   * ✅ Helpers: iniciales tipo chat
   */
  const buildInitials = useCallback((name: string) => {
    const clean = (name ?? '').trim().replace(/\s+/g, ' ');
    if (!clean) return '?';

    const parts = clean.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    const first = parts[0]?.[0] ?? '';
    const last = parts[parts.length - 1]?.[0] ?? '';
    return `${first}${last}`.toUpperCase();
  }, []);

  /**
   * ✅ Carga usuarios para mostrar nombre/avatar en los markers
   */
  useEffect(() => {
    (async () => {
      try {
        const users = await usersUseCase.execute();

        const map: Record<string, UserMini> = {};
        for (const u of users) {
          map[u.id] = {
            displayName: u.displayName,
            // ✅ Si existe en tu entidad AppUser (según tu historial), lo guardamos
            avatarUrl: (u as any).avatarUrl ?? null,
          };
        }
        setUsersById(map);
      } catch {
        // No bloqueamos UX si falla. Se verá un fallback con iniciales/id corto.
      }
    })();
  }, [usersUseCase]);

  /**
   * ✅ Permisos de ubicación (foreground)
   */
  const ensureLocationPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === 'granted';
    setHasLocationPerm(granted);

    if (!granted) {
      Alert.alert('Permiso requerido', 'Debes permitir ubicación para centrar el mapa en tu posición.');
      return false;
    }
    return true;
  }, []);

  /**
   * ✅ Obtener coordenadas actuales
   */
  const getCurrentCoords = useCallback(async () => {
    const ok = await ensureLocationPermission();
    if (!ok) return null;

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  }, [ensureLocationPermission]);

  /**
   * ✅ Centrar mapa al abrir (si hay permisos)
   */
  useEffect(() => {
    (async () => {
      const coords = await getCurrentCoords();
      if (!coords) return;

      setMyCoords(coords);

      const initial: Region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.018,
        longitudeDelta: 0.018,
      };

      setRegion(initial);
      requestAnimationFrame(() => mapRef.current?.animateToRegion(initial, 450));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * ✅ Mantener MI ubicación actualizada (solo para mostrar en el mapa)
   */
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      if (!hasLocationPerm) return;

      const coords = await getCurrentCoords();
      if (!coords) return;

      setMyCoords(coords);
    };

    timer = setInterval(() => void tick(), 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [getCurrentCoords, hasLocationPerm]);

  /**
   * ✅ Polling de usuarios conectados (ubicación reciente)
   */
  const fetchActive = useCallback(async () => getActiveUseCase.execute(120), [getActiveUseCase]);

  useFocusPolling<ActiveUserLocation[]>({
    enabled: true,
    intervalMs: 2000,
    fetcher: fetchActive,
    onData: (data) => {
      setActiveLocations(data);

      // ✅ Fallback: si NO se pudo centrar por permisos, centra al primer activo.
      if (!region && data.length > 0) {
        const first = data[0];
        const initial: Region = {
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        };
        setRegion(initial);
        requestAnimationFrame(() => mapRef.current?.animateToRegion(initial, 450));
      }
    },
  });

  /**
   * ✅ Helpers UI
   */
  const getDisplayName = useCallback(
    (userId: string) => {
      if (userId === myUserId) return 'Tu';
      return usersById[userId]?.displayName ?? userId.slice(0, 8);
    },
    [myUserId, usersById],
  );

  const getAvatarUrl = useCallback(
    (userId: string) => {
      return usersById[userId]?.avatarUrl ?? null;
    },
    [usersById],
  );

  const centerOnMe = useCallback(async () => {
    const coords = await getCurrentCoords();
    if (!coords) return;

    setMyCoords(coords);

    const next: Region = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.018,
      longitudeDelta: 0.018,
    };

    setRegion(next);
    requestAnimationFrame(() => mapRef.current?.animateToRegion(next, 450));
  }, [getCurrentCoords]);

  /**
   * ✅ Normalizamos markers:
   * - Mi marker se toma desde GPS local (myCoords) si existe.
   * - Los demás vienen desde activeLocations (excluyendo miUserId para no duplicar).
   */
  const otherLocations = useMemo(
    () => activeLocations.filter((l) => l.userId !== myUserId),
    [activeLocations, myUserId],
  );

  /**
   * ✅ Render del avatar del marker:
   * - Si hay avatarUrl => imagen
   * - Si no => iniciales
   */
  const renderUserMarkerAvatar = useCallback(
    (userId: string) => {
      const name = getDisplayName(userId);
      const avatarUrl = getAvatarUrl(userId);

      // ✅ Si hay foto: se muestra la imagen
      if (avatarUrl) {
        return (
          <View style={s.markerAvatarWrap}>
            <Image source={{ uri: avatarUrl }} style={s.markerAvatarImg} />
          </View>
        );
      }

      // ✅ Si no hay foto: círculo con iniciales (como chat)
      const initials = buildInitials(name);

      return (
        <View style={s.markerInitialsWrap}>
          <Text style={s.markerInitialsText} numberOfLines={1}>
            {initials}
          </Text>
        </View>
      );
    },
    [buildInitials, getAvatarUrl, getDisplayName],
  );

  return (
    <SafeAreaView style={[s.safe, { paddingTop: insets.top }]} edges={['top']}>
      {/* ✅ Header */}
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} style={s.headerBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>Usuarios conectados</Text>
          <Text style={s.headerSub}>{activeLocations.length} activos • ubicación reciente</Text>
        </View>

        <Pressable onPress={centerOnMe} style={s.headerBtn} hitSlop={10}>
          <Ionicons name="locate-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* ✅ Map */}
      <View style={s.mapWrap}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={s.map}
          initialRegion={
            region ?? {
              latitude: -33.45,
              longitude: -70.66,
              latitudeDelta: 0.09,
              longitudeDelta: 0.09,
            }
          }
          onRegionChangeComplete={(r) => setRegion(r)}
        >
          {/* ✅ MI ubicación (avatar o iniciales) */}
          {myCoords && (
            <Marker
              coordinate={{ latitude: myCoords.latitude, longitude: myCoords.longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              {renderUserMarkerAvatar(myUserId)}
            </Marker>
          )}

          {/* ✅ Otros usuarios activos (avatar o iniciales) */}
          {otherLocations.map((loc) => (
            <Marker
              key={loc.userId}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              {renderUserMarkerAvatar(loc.userId)}
            </Marker>
          ))}
        </MapView>

        {/* ✅ Status pill */}
        {!hasLocationPerm ? (
          <View style={s.statusPill}>
            <Ionicons name="lock-closed-outline" size={16} color="#0b2b52" />
            <Text style={s.statusText}>Permite ubicación para mostrar tu posición en el mapa</Text>
          </View>
        ) : (
          <View style={s.statusPill}>
            <Ionicons name="location-outline" size={16} color="#0b2b52" />
            <Text style={s.statusText}>Mostrando ubicaciones activas en el mapa</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
