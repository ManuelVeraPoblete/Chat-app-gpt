// src/presentation/screens/Chat/components/AttachSheet.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './AttachSheet.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPickImages: () => void;
  onPickDocuments: () => void;
};

/**
 * ✅ AttachSheet (Bottom Sheet PRO)
 * - SRP: componente y estilos propios (no depende de ChatScreen.styles)
 * - Animación: slide desde abajo + fade del overlay
 * - UX: botón Cancelar y cierre al tocar overlay
 */
export function AttachSheet({ visible, onClose, onPickImages, onPickDocuments }: Props) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(1)).current;

  // ✅ Interpolación (1 => oculto abajo, 0 => visible)
  const translateY = useMemo(
    () =>
      sheetTranslateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 320], // distancia hacia abajo
      }),
    [sheetTranslateY],
  );

  useEffect(() => {
    if (visible) {
      // ✅ Mostrar
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
      return;
    }

    // ✅ Ocultar (cuando visible pasa a false desde afuera)
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start();
  }, [overlayOpacity, sheetTranslateY, visible]);

  /**
   * ✅ Cierre animado: primero anima, luego onClose
   * (Esto evita “corte” al cerrar el modal)
   */
  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  const handlePickImages = () => {
    closeWithAnimation();
    // ✅ Disparamos luego para evitar glitch visual del modal
    setTimeout(() => onPickImages(), 80);
  };

  const handlePickDocuments = () => {
    closeWithAnimation();
    setTimeout(() => onPickDocuments(), 80);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeWithAnimation}>
      {/* ✅ Overlay con fade */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={styles.overlayPressArea} onPress={closeWithAnimation} />
      </Animated.View>

      {/* ✅ Sheet con slide */}
      <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}>
        <View style={styles.sheetCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Adjuntar</Text>
            <Pressable onPress={closeWithAnimation} style={styles.closeBtn} hitSlop={10}>
              <Ionicons name="close" size={18} color="#0b2b52" />
            </Pressable>
          </View>

          <View style={styles.row}>
            <Pressable style={styles.item} onPress={handlePickImages}>
              <View style={styles.iconCircle}>
                <Ionicons name="image-outline" size={20} color="#0b2b52" />
              </View>
              <Text style={styles.itemText}>Galería</Text>
            </Pressable>

            <Pressable style={styles.item} onPress={handlePickDocuments}>
              <View style={styles.iconCircle}>
                <Ionicons name="document-text-outline" size={20} color="#0b2b52" />
              </View>
              <Text style={styles.itemText}>Archivo</Text>
            </Pressable>
          </View>

          <Pressable onPress={closeWithAnimation} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}
