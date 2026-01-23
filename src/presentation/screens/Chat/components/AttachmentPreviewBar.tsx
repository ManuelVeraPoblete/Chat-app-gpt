import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { LocalAttachment } from '../types/localAttachment.types';
import { formatBytes } from '../../../../shared/utils/formatBytes';
import { styles } from '../ChatScreen.styles';

type Props = {
  attachments: LocalAttachment[];
  onRemove: (id: string) => void;
};

/**
 * ✅ AttachmentPreviewBar
 * Muestra archivos seleccionados antes de enviar (WhatsApp-like).
 *
 * SRP:
 * - Solo renderiza previews y permite remover.
 * - No contiene lógica de pickers ni envío.
 */
export function AttachmentPreviewBar({ attachments, onRemove }: Props) {
  if (!attachments.length) return null;

  return (
    <View style={styles.attachPreviewContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.attachPreviewScroll}
      >
        {attachments.map((att) => {
          const isImage = att.kind === 'image';

          return (
            <View key={att.id} style={styles.attachPreviewItem}>
              {isImage ? (
                <Image source={{ uri: att.uri }} style={styles.attachPreviewImage} />
              ) : (
                <View style={styles.attachPreviewFile}>
                  <Ionicons name="document-text-outline" size={18} color="#0b2b52" />
                  <Text style={styles.attachPreviewFileName} numberOfLines={1}>
                    {att.name}
                  </Text>
                  <Text style={styles.attachPreviewFileSize}>{formatBytes(att.size)}</Text>
                </View>
              )}

              {/* ✅ Botón remover */}
              <Pressable
                onPress={() => onRemove(att.id)}
                style={styles.attachRemoveBtn}
                hitSlop={10}
              >
                <Ionicons name="close" size={14} color="#fff" />
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
