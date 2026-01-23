import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../ChatScreen.styles';

type Props = {
  visible: boolean;
  onClose: () => void;

  onPickImages: () => void;
  onPickDocuments: () => void;
};

/**
 * ✅ AttachSheet
 * Modal inferior (sheet) para seleccionar tipo de adjunto.
 *
 * SRP:
 * - Solo UI + eventos
 * - No conoce pickers ni lógica de envío
 */
export function AttachSheet({ visible, onClose, onPickImages, onPickDocuments }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.attachSheetOverlay} onPress={onClose}>
        <Pressable style={styles.attachSheetCard} onPress={() => {}}>
          <Text style={styles.attachSheetTitle}>Adjuntar</Text>

          <View style={styles.attachSheetRow}>
            <Pressable
              style={styles.attachSheetItem}
              onPress={() => {
                onClose();
                onPickImages();
              }}
            >
              <View style={styles.attachSheetIconCircle}>
                <Ionicons name="images-outline" size={20} color="#0b2b52" />
              </View>
              <Text style={styles.attachSheetText}>Galería</Text>
            </Pressable>

            <Pressable
              style={styles.attachSheetItem}
              onPress={() => {
                onClose();
                onPickDocuments();
              }}
            >
              <View style={styles.attachSheetIconCircle}>
                <Ionicons name="document-text-outline" size={20} color="#0b2b52" />
              </View>
              <Text style={styles.attachSheetText}>Documento</Text>
            </Pressable>
          </View>

          <Pressable style={styles.attachSheetCancel} onPress={onClose}>
            <Text style={styles.attachSheetCancelText}>Cancelar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
