import React, { memo, useCallback, useMemo } from 'react';
import { Linking, Platform, Pressable, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import type { OutgoingLocation } from '../../../../domain/chat/entities/ChatMessage';
import { styles } from './LocationMessageCard.styles';

type Props = {
  /**
   * ✅ Recibe SOLO coordenadas (fuente de verdad)
   * El link mapsUrl se construye acá internamente (Clean Code).
   */
  location: OutgoingLocation;
};

/**
 * ✅ LocationMessageCard (WhatsApp-like)
 * Renderiza una tarjeta con mini mapa y botón "Abrir en Maps"
 *
 * ✅ Clean Code:
 * - La UI recibe coordenadas puras (lat/lng)
 * - Deriva mapsUrl internamente
 */
export const LocationMessageCard = memo(function LocationMessageCard({ location }: Props) {
  const region: Region = useMemo(
    () => ({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [location.latitude, location.longitude],
  );

  /**
   * ✅ Link universal Google Maps (funciona en Android/iOS)
   */
  const mapsUrl = useMemo(() => {
    const { latitude, longitude } = location;
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }, [location.latitude, location.longitude]);

  const openMaps = useCallback(async () => {
    try {
      await Linking.openURL(mapsUrl);
    } catch {
      // ✅ No romper UX
    }
  }, [mapsUrl]);

  return (
    <View style={styles.card}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        region={region}
        // ✅ Modo thumbnail, sin gestos (WhatsApp-like)
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        toolbarEnabled={false}
      >
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
      </MapView>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.title} numberOfLines={1}>
            {location.label?.trim() ? location.label : 'Ubicación compartida'}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Abrir en Google Maps
          </Text>
        </View>

        <Pressable style={styles.openBtn} onPress={openMaps} hitSlop={10}>
          <Ionicons name="navigate-outline" size={16} color="#fff" />
          <Text style={styles.openBtnText}>Abrir</Text>
        </Pressable>
      </View>
    </View>
  );
});
