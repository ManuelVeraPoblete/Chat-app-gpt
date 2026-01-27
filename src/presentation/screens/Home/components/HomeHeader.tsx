import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HomeHeader.styles';

type Props = {
  currentUserName: string;
  query: string;
  onChangeQuery: (text: string) => void;

  // ✅ NUEVO: abrir mapa de conectados
  onPressLocations: () => void;

  // ✅ Logout
  onPressLogout: () => void;
};

/**
 * HomeHeader
 * - Header corporativo
 * - ✅ Buscador
 * - ✅ Mapa + Logout
 */
export function HomeHeader({
  currentUserName,
  query,
  onChangeQuery,
  onPressLocations,
  onPressLogout,
}: Props) {
  const initial = (currentUserName?.trim()?.[0] ?? 'C').toUpperCase();

  return (
    <View style={styles.header}>
      {/* Avatar del usuario actual */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        {/* Indicador online */}
        <View style={styles.onlineDot} />
      </View>

      {/* Buscador */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#EAF2FF" />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Buscar"
          placeholderTextColor="#EAF2FF"
          style={styles.searchInput}
        />
      </View>

      {/* ✅ MAPA */}
      <Pressable style={styles.iconBtn} onPress={onPressLocations} hitSlop={10}>
        <Ionicons name="map-outline" size={22} color="#FFFFFF" />
      </Pressable>

      {/* ✅ LOGOUT */}
      <Pressable style={styles.iconBtn} onPress={onPressLogout} hitSlop={10}>
        <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
