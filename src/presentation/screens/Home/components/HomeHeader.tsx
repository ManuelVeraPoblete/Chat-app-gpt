import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './HomeHeader.styles';
import { AvatarCircle } from './AvatarCircle';

type Props = {
  currentUserName: string;
  query: string;
  onChangeQuery: (value: string) => void;
  onPressCamera: () => void;
  onPressNewChat: () => void;
};

/**
 * Header estilo WhatsApp (como imagen):
 * ✅ Respeta SafeArea (notch/status bar)
 * ✅ Avatar + buscador + cámara + nuevo chat
 */
export function HomeHeader({
  currentUserName,
  query,
  onChangeQuery,
  onPressCamera,
  onPressNewChat,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.row}>
        <AvatarCircle name={currentUserName} size={42} badge="online" />

        <View style={styles.searchWrap}>
          <BlurView intensity={22} tint="light" style={styles.searchBlur}>
            <TextInput
              value={query}
              onChangeText={onChangeQuery}
              placeholder="Buscar"
              placeholderTextColor="rgba(255,255,255,0.80)"
              style={styles.searchInput}
            />
          </BlurView>
        </View>

        <Pressable style={styles.iconBtn} onPress={onPressCamera}>
          <Ionicons name="camera-outline" size={26} color="#fff" />
        </Pressable>

        <Pressable style={styles.iconBtn} onPress={onPressNewChat}>
          <Ionicons name="create-outline" size={26} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
