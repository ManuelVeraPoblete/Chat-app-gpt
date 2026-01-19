import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ChatHeader.styles';

type Props = {
  title: string;     // Nombre (ej: Asistente Corporativo)
  subtitle?: string; // Estado (ej: En línea)
  onBack: () => void;
};

/**
 * ChatHeader
 * - Header delgado tipo WhatsApp
 * - Avatar + nombre + estado
 * - Botón back a la izquierda
 */
export function ChatHeader({ title, subtitle = 'En línea', onBack }: Props) {
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <View style={styles.header}>
      {/* Back */}
      <Pressable style={styles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </Pressable>

      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.onlineDot} />
      </View>

      {/* Title + Subtitle */}
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
