import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../ChatScreen.styles';
import { formatBytes } from '../../../../shared/utils/formatBytes';

export type UiAttachment = {
  id: string;
  kind: 'image' | 'file';
  uri: string; // ✅ URL pública (backend) o local (optimistic)
  name: string;
  mimeType: string;
  size?: number;
};

type Props = {
  attachments: UiAttachment[];
  onOpenImage: (uri: string) => void;
  onOpenFile: (uri: string) => void;
};

/**
 * ✅ MessageAttachments
 * Renderiza adjuntos dentro del bubble del mensaje.
 *
 * SRP:
 * - Solo UI.
 * - No contiene lógica de selección ni envío.
 */
export function MessageAttachments({ attachments, onOpenImage, onOpenFile }: Props) {
  if (!attachments.length) return null;

  const images = attachments.filter((a) => a.kind === 'image');
  const files = attachments.filter((a) => a.kind === 'file');

  return (
    <View style={styles.msgAttachmentsWrap}>
      {/* ✅ Imágenes */}
      {images.length > 0 && (
        <View style={styles.msgImagesRow}>
          {images.slice(0, 3).map((img, idx) => {
            const more = images.length - 3;

            return (
              <Pressable
                key={img.id}
                onPress={() => onOpenImage(img.uri)}
                style={styles.msgImagePress}
              >
                <Image source={{ uri: img.uri }} style={styles.msgImageThumb} />

                {/* ✅ Overlay +N si hay más */}
                {idx === 2 && more > 0 && (
                  <View style={styles.msgImageMoreOverlay}>
                    <Text style={styles.msgImageMoreText}>+{more}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      {/* ✅ Archivos */}
      {files.length > 0 && (
        <View style={styles.msgFilesCol}>
          {files.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => onOpenFile(normalizeUri(f.uri))}
              style={styles.msgFileRow}
            >
              <Ionicons name="document-text-outline" size={18} color="#0b2b52" />

              <View style={styles.msgFileMeta}>
                <Text style={styles.msgFileName} numberOfLines={1}>
                  {f.name}
                </Text>
                <Text style={styles.msgFileSize}>{formatBytes(f.size)}</Text>
              </View>

              <Ionicons name="download-outline" size={18} color="#0b2b52" />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * ✅ Normaliza URI
 * Asegura que sea una URL válida (http/https) o un file:// local.
 */
function normalizeUri(uri: string): string {
  if (!uri) return uri;
  if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
  if (uri.startsWith('file://') || uri.startsWith('content://')) return uri;

  // ✅ si viene sin esquema, intentamos como https (por seguridad)
  return `https://${uri}`;
}
