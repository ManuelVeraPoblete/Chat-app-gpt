// src/presentation/screens/Locations/LocationsScreen.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, Modal, Platform, Pressable, Text, View } from 'react-native';
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
  email?: string | null;
  phone?: string | null;
};

type SelectedUser = {
  userId: string;
  displayName: string;
  email: string | null;
  phone: string | null;
};

/**
 * ✅ LocationsScreen (FRONT)
 * - Flechas: verde (yo) / rojo (otros)
 * - Tap en flecha => Modal con info
 * - Teléfono: clickeable (dialer nativo)
 * - Correo: texto normal (sin link)
 * - Botón/Link "Chat": abre pantalla de chat con ese usuario
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

  // ✅ Modal
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const closeModal = useCallback(() => setSelectedUser(null), []);

  /**
   * ✅ Utils: sanitizar teléfono y abrir apps nativas
   */
  const sanitizePhone = useCallback((raw: string) => raw.replace(/[^\d+]/g, ''), []);

  const openNativePhoneDialer = useCallback(
    async (rawPhone: string) => {
      const phone = sanitizePhone(rawPhone);

      if (!phone) {
        Alert.alert('Teléfono inválido', 'El número no tiene un formato válido.');
        return;
      }

      const url = `tel:${phone}`;
      const can = await Linking.canOpenURL(url);

      if (!can) {
        Alert.alert('No disponible', 'No se pudo abrir la app de Teléfono en este dispositivo.');
        return;
      }

      await Linking.openURL(url);
    },
    [sanitizePhone],
  );

  /**
   * ✅ Abrir chat con un usuario (navegación)
   * IMPORTANTE:
   * - Ajusta "Chat" por el nombre real de tu ruta si difiere (ej: Routes.Chat).
   * - Ajusta los params según tu ChatScreen.
   */
  const openChatWithUser = useCallback(
    (user: SelectedUser) => {
      if (!user?.userId) return;

      if (user.userId === myUserId) {
        Alert.alert('Acción no disponible', 'No puedes abrir un chat contigo mismo.');
        return;
      }

      closeModal();

      // ✅ Navegación: usa el nombre real de tu screen de chat
      // Si tu app usa Routes.Chat, reemplaza 'Chat' por Routes.Chat.
      (navigation as any).navigate('Chat', {
        userId: user.userId,
        displayName: user.displayName,
      });
    },
    [closeModal, myUserId, navigation],
  );

  /**
   * ✅ Carga usuarios para nombre/correo/teléfono en modal
   */
  useEffect(() => {
    (async () => {
      try {
        const users = await usersUseCase.execute();

        const map: Record<string, UserMini> = {};
        for (const u of users as any[]) {
          map[u.id] = {
            displayName: u.displayName,
            email: u.email ?? null,
            phone: u.phone ?? null,
          };
        }

        setUsersById(map);
      } catch {
        // UX degrade suave
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
      Alert.alert('Permiso requerido', 'Debes permitir ubicación para centrar el mapa en tu posición.');
      return false;
    }
    return true;
  }, []);

  /**
   * ✅ Coordenadas actuales
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
   * ✅ Centrar mapa al abrir
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
   * ✅ Mantener MI ubicación actualizada
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
   * ✅ Polling de ubicaciones activas
   */
  const fetchActive = useCallback(async () => getActiveUseCase.execute(120), [getActiveUseCase]);

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
   * ✅ Helpers UI
   */
  const getUserInfo = useCallback(
    (userId: string): SelectedUser => {
      const info = usersById[userId];

      const displayName = userId === myUserId ? 'Tu' : info?.displayName ?? userId.slice(0, 8);
      const email = info?.email ?? null;
      const phone = info?.phone ?? null;

      return { userId, displayName, email, phone };
    },
    [myUserId, usersById],
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

  const otherLocations = useMemo(
    () => activeLocations.filter((l) => l.userId !== myUserId),
    [activeLocations, myUserId],
  );

  /**
   * ✅ Marker: flecha (tap => modal)
   */
  const renderArrowMarker = useCallback(
    (userId: string, isMe: boolean) => {
      const color = isMe ? '#22c55e' : '#ef4444';

      return (
        <Pressable onPress={() => setSelectedUser(getUserInfo(userId))} style={s.markerWrap} hitSlop={10}>
          <View style={s.markerArrowWrap}>
            <Ionicons name="navigate" size={30} color={color} />
          </View>

          <View style={s.markerLabelWrap}>
            <Text style={s.markerLabelText} numberOfLines={1}>
              {getUserInfo(userId).displayName}
            </Text>
          </View>
        </Pressable>
      );
    },
    [getUserInfo],
  );

  const isChatEnabled = selectedUser?.userId && selectedUser.userId !== myUserId;

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
          {/* ✅ MI ubicación (flecha verde) */}
          {myCoords && (
            <Marker
              coordinate={{ latitude: myCoords.latitude, longitude: myCoords.longitude }}
              anchor={{ x: 0.5, y: 1 }}
              onPress={() => setSelectedUser(getUserInfo(myUserId))}
            >
              {renderArrowMarker(myUserId, true)}
            </Marker>
          )}

          {/* ✅ Otros usuarios (flecha roja) */}
          {otherLocations.map((loc) => (
            <Marker
              key={loc.userId}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              anchor={{ x: 0.5, y: 1 }}
              onPress={() => setSelectedUser(getUserInfo(loc.userId))}
            >
              {renderArrowMarker(loc.userId, false)}
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
            <Text style={s.statusText}>Toca una flecha para ver datos del usuario</Text>
          </View>
        )}
      </View>

      {/* ✅ Modal de usuario */}
      <Modal visible={Boolean(selectedUser)} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={s.modalBackdrop} onPress={closeModal}>
          <Pressable style={s.modalCard} onPress={() => {}}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Información del usuario</Text>
              <Pressable onPress={closeModal} hitSlop={10} style={s.modalCloseBtn}>
                <Ionicons name="close" size={18} color="#0b2b52" />
              </Pressable>
            </View>

            <View style={s.modalBody}>
              <View style={s.modalRow}>
                <Text style={s.modalLabel}>Nombre</Text>
                <Text style={s.modalValue} numberOfLines={2}>
                  {selectedUser?.displayName ?? '—'}
                </Text>
              </View>

              {/* ✅ Correo SIN link */}
              <View style={s.modalRow}>
                <Text style={s.modalLabel}>Correo</Text>
                <Text style={s.modalValue} numberOfLines={2}>
                  {selectedUser?.email ?? '—'}
                </Text>
              </View>

              {/* ✅ Teléfono con ícono + link al dialer */}
              <View style={s.modalRow}>
                <Text style={s.modalLabel}>Teléfono</Text>

                {selectedUser?.phone ? (
                  <Pressable
                    onPress={() => void openNativePhoneDialer(selectedUser.phone!)}
                    hitSlop={10}
                    style={s.phoneRowPressable}
                  >
                    <Ionicons name="call-outline" size={16} color="#0b2b52" />
                    <Text style={s.modalValueLink} numberOfLines={2}>
                      {selectedUser.phone}
                    </Text>
                  </Pressable>
                ) : (
                  <Text style={s.modalValue} numberOfLines={2}>
                    —
                  </Text>
                )}
              </View>

              {/* ✅ Link/Botón de Chat */}
              <View style={s.modalActions}>
                <Pressable
                  disabled={!isChatEnabled}
                  onPress={() => selectedUser && openChatWithUser(selectedUser)}
                  style={[s.chatActionBtn, !isChatEnabled && s.chatActionBtnDisabled]}
                  hitSlop={10}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color={isChatEnabled ? '#fff' : 'rgba(255,255,255,0.7)'} />
                  <Text style={[s.chatActionText, !isChatEnabled && s.chatActionTextDisabled]}>
                    Abrir chat
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
