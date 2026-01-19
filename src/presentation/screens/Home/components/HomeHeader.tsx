import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HomeHeader.styles';

type Props = {
  currentUserName: string;
  query: string;
  onChangeQuery: (text: string) => void;

  /**
   * ✅ Solo dejamos Logout
   */
  onPressLogout: () => void;
};

/**
 * HomeHeader
 * - Header tipo WhatsApp corporativo
 * - ✅ Más delgado
 * - ✅ Solo icono Logout
 */
export function HomeHeader({ currentUserName, query, onChangeQuery, onPressLogout }: Props) {
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

      {/* ✅ SOLO LOGOUT */}
      <Pressable style={styles.iconBtn} onPress={onPressLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
