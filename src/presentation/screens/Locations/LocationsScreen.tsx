import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
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
import { UpdateMyLocationUseCase } from '../../../domain/locations/usecases/UpdateMyLocationUseCase';
import { StopSharingLocationUseCase } from '../../../domain/locations/usecases/StopSharingLocationUseCase';

import type { ActiveUserLocation } from '../../../domain/locations/entities/UserLocation';
import { useFocusPolling } from '../../../shared/hooks/useFocusPolling';

import { styles as s } from './LocationsScreen.styles';

/**
 * ✅ LocationsScreen
 * - Mapa con usuarios conectados (ubicación reciente)
 * - Compartir mi ubicación puntual o en vivo (tipo WhatsApp)
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
  const updateMyLocationUseCase = useMemo(() => new UpdateMyLocationUseCase(locationsRepo), [locationsRepo]);
  const stopSharingUseCase = useMemo(() => new StopSharingLocationUseCase(locationsRepo), [locationsRepo]);

  /**
   * ✅ UI state
   */
  const mapRef = useRef<MapView | null>(null); // ✅ Correcto para ref
  const [region, setRegion] = useState<Region | null>(null);

  const [activeLocations, setActiveLocations] = useState<ActiveUserLocation[]>([]);
  const [usersById, setUsersById] = useState<Record<string, { displayName: string }>>({});

  const [hasLocationPerm, setHasLocationPerm] = useState<boolean>(false);
  const [isLiveSharing, setIsLiveSharing] = useState(false);
  const [liveMinutes, setLiveMinutes] = useState<15 | 60 | 480>(15);
  const liveUntilTsRef = useRef<number | null>(null);

  /**
   * ✅ Carga usuarios para mostrar nombres en los markers
   */
  useEffect(() => {
    (async () => {
      try {
        const users = await usersUseCase.execute();
        const map: Record<string, { displayName: string }> = {};
        for (const u of users) map[u.id] = { displayName: u.displayName };
        setUsersById(map);
      } catch {
        // No bloqueamos la pantalla si falla, solo se verá el userId.
      }
    })();
  }, [usersUseCase]);

  /**
   * ✅ Permisos de ubicación
   */
  const ensureLocationPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === 'granted';
    setHasLocationPerm(granted);

    if (!granted) {
      Alert.alert(
        'Permiso requerido',
        'Debes permitir ubicación para compartirla o centrar el mapa en tu posición.',
      );
      return false;
    }
    return true;
  }, []);

  /**
   * ✅ Obtener coordenadas actuales (modo eficiente)
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
      accuracy: pos.coords.accuracy ?? undefined,
    };
  }, [ensureLocationPermission]);

  /**
   * ✅ Centrar mapa al abrir
   */
  useEffect(() => {
    (async () => {
      const coords = await getCurrentCoords();
      if (!coords) return;

      const initial: Region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.018,
        longitudeDelta: 0.018,
      };

      setRegion(initial);

      requestAnimationFrame(() => {
        mapRef.current?.animateToRegion(initial, 450);
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * ✅ Polling de usuarios conectados
   */
  const fetchActive = useCallback(async () => {
    return getActiveUseCase.execute(120);
  }, [getActiveUseCase]);

  useFocusPolling<ActiveUserLocation[]>({
    enabled: true,
    intervalMs: 2000,
    fetcher: fetchActive,
    onData: (data) => {
      setActiveLocations(data);

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
   * ✅ Compartir ubicación puntual (1 vez)
   */
  const shareOnce = useCallback(async () => {
    const coords = await getCurrentCoords();
    if (!coords) return;

    try {
      await updateMyLocationUseCase.execute({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        isLive: false,
      });

      Alert.alert('Ubicación enviada', 'Tu ubicación se compartió con usuarios conectados.');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo compartir la ubicación');
    }
  }, [getCurrentCoords, updateMyLocationUseCase]);

  /**
   * ✅ Iniciar Live Location (tipo WhatsApp)
   */
  const startLiveSharing = useCallback(async () => {
    const coords = await getCurrentCoords();
    if (!coords) return;

    try {
      await updateMyLocationUseCase.execute({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        isLive: true,
        liveMinutes,
      });

      liveUntilTsRef.current = Date.now() + liveMinutes * 60_000;
      setIsLiveSharing(true);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo iniciar ubicación en vivo');
    }
  }, [getCurrentCoords, updateMyLocationUseCase, liveMinutes]);

  /**
   * ✅ Detener live sharing
   */
  const stopLiveSharing = useCallback(async () => {
    try {
      await stopSharingUseCase.execute();
    } catch {
      // No bloqueamos UX si falla, pero detenemos en UI igual.
    } finally {
      liveUntilTsRef.current = null;
      setIsLiveSharing(false);
    }
  }, [stopSharingUseCase]);

  /**
   * ✅ Intervalo de actualización live (cada 5s)
   */
  useEffect(() => {
    if (!isLiveSharing) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;

      const until = liveUntilTsRef.current;
      if (until && Date.now() >= until) {
        await stopLiveSharing();
        return;
      }

      const coords = await getCurrentCoords();
      if (!coords) return;

      try {
        await updateMyLocationUseCase.execute({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          isLive: true,
          liveMinutes,
        });
      } catch {
        // No spameamos alertas por problemas de red
      }
    };

    void tick();
    timer = setInterval(() => void tick(), 5000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [getCurrentCoords, isLiveSharing, liveMinutes, stopLiveSharing, updateMyLocationUseCase]);

  /**
   * ✅ Helpers UI
   */
  const getUserLabel = useCallback(
    (userId: string) => {
      if (userId === myUserId) return 'Tú';
      return usersById[userId]?.displayName ?? userId.slice(0, 8);
    },
    [myUserId, usersById],
  );

  const centerOnMe = useCallback(async () => {
    const coords = await getCurrentCoords();
    if (!coords) return;

    const next: Region = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.018,
      longitudeDelta: 0.018,
    };

    setRegion(next);
    requestAnimationFrame(() => mapRef.current?.animateToRegion(next, 450));
  }, [getCurrentCoords]);

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
          ref={mapRef} // ✅ FIX PROFESIONAL (ref object)
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
          {activeLocations.map((loc) => (
            <Marker
              key={loc.userId}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              title={getUserLabel(loc.userId)}
              description={loc.isLive ? 'Ubicación en vivo' : 'Ubicación reciente'}
              pinColor={loc.userId === myUserId ? '#2b69a6' : '#0b2b52'}
            />
          ))}
        </MapView>

        {/* ✅ Status pill */}
        <View style={s.statusPill}>
          <Ionicons name={isLiveSharing ? 'radio-outline' : 'time-outline'} size={16} color="#0b2b52" />
          <Text style={s.statusText}>
            {isLiveSharing ? `Compartiendo en vivo (${liveMinutes}m)` : 'No estás compartiendo en vivo'}
          </Text>
        </View>
      </View>

      {/* ✅ Controls */}
      <View style={s.controls}>
        <View style={s.liveRow}>
          <Text style={s.liveLabel}>Live:</Text>

          <Pressable
            style={[s.liveChip, liveMinutes === 15 && s.liveChipActive]}
            onPress={() => setLiveMinutes(15)}
          >
            <Text style={[s.liveChipText, liveMinutes === 15 && s.liveChipTextActive]}>15m</Text>
          </Pressable>

          <Pressable
            style={[s.liveChip, liveMinutes === 60 && s.liveChipActive]}
            onPress={() => setLiveMinutes(60)}
          >
            <Text style={[s.liveChipText, liveMinutes === 60 && s.liveChipTextActive]}>1h</Text>
          </Pressable>

          <Pressable
            style={[s.liveChip, liveMinutes === 480 && s.liveChipActive]}
            onPress={() => setLiveMinutes(480)}
          >
            <Text style={[s.liveChipText, liveMinutes === 480 && s.liveChipTextActive]}>8h</Text>
          </Pressable>
        </View>

        <View style={s.actionsRow}>
          <Pressable style={s.primaryBtn} onPress={shareOnce}>
            <Ionicons name="send-outline" size={16} color="#fff" />
            <Text style={s.primaryBtnText}>Compartir ubicación</Text>
          </Pressable>

          {!isLiveSharing ? (
            <Pressable style={s.secondaryBtn} onPress={startLiveSharing}>
              <Ionicons name="radio-outline" size={16} color="#0b2b52" />
              <Text style={s.secondaryBtnText}>Compartir en vivo</Text>
            </Pressable>
          ) : (
            <Pressable style={s.dangerBtn} onPress={stopLiveSharing}>
              <Ionicons name="stop-circle-outline" size={16} color="#fff" />
              <Text style={s.dangerBtnText}>Detener</Text>
            </Pressable>
          )}
        </View>

        {!hasLocationPerm && (
          <Pressable style={s.permBtn} onPress={ensureLocationPermission}>
            <Ionicons name="lock-open-outline" size={16} color="#0b2b52" />
            <Text style={s.permBtnText}>Habilitar permisos de ubicación</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
