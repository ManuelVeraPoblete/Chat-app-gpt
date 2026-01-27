import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';

import { styles } from './ChatScreen.styles';
import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/AppNavigator';

import { AvatarCircle } from '../Home/components/AvatarCircle';
import { useApi } from '../../../state/api/ApiContext';
import { useAuth } from '../../../state/auth/AuthContext';

import { ENV } from '../../../core/config/env';
import { useFocusPolling } from '../../../shared/hooks/useFocusPolling';
import { useKeyboard } from '../../../shared/hooks/useKeyboard';

import { ChatRepositoryHttp } from '../../../domain/chat/ChatRepositoryHttp';
import { GetChatMessagesUseCase } from '../../../domain/chat/GetChatMessagesUseCase';
import { SendChatMessageUseCase } from '../../../domain/chat/usecases/SendChatMessageUseCase';

import type {
  ChatAttachment,
  ChatMessage as ApiChatMessage,
  OutgoingAttachment,
  OutgoingLocation,
} from '../../../domain/chat/entities/ChatMessage';

import type { LocalAttachment } from './types/localAttachment.types';
import { AttachmentPreviewBar } from './components/AttachmentPreviewBar';
import { MessageAttachments, type UiAttachment } from './components/MessageAttachments';
import { AttachSheet } from './components/AttachSheet';

// ✅ Tarjeta de ubicación WhatsApp-like (con mini mapa)
import { LocationMessageCard } from './components/LocationMessageCard';

/**
 * ✅ Tipos de navegación
 */
type ChatRoute = RouteProp<RootStackParamList, typeof Routes.Chat>;
type ChatNav = NativeStackNavigationProp<RootStackParamList>;

type SendStatus = 'sending' | 'delivered';

type UiChatMessage = {
  id: string;
  text: string;
  createdAt: Date;
  from: 'me' | 'other';
  status?: SendStatus;
  attachments?: UiAttachment[];
  location?: OutgoingLocation; // ✅ NUEVO: ubicación en UI
};

/**
 * ✅ Guard Android: barra emojis / suggestions overlay
 */
const ANDROID_EMOJI_BAR_GUARD = 44;

/**
 * ✅ Límites WhatsApp-like (ajústalos si deseas)
 */
const MAX_ATTACHMENTS_PER_MESSAGE = 10;
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export function ChatScreen() {
  const navigation = useNavigation<ChatNav>();
  const route = useRoute<ChatRoute>();

  const [isAttachSheetOpen, setIsAttachSheetOpen] = useState(false);

  const insets = useSafeAreaInsets();
  const keyboard = useKeyboard();
  const { height: windowHeight } = useWindowDimensions();

  const { http } = useApi();
  const { session } = useAuth();

  const { displayName, userId: peerId, email } = route.params;
  const myUserId = session?.user?.id ?? '';

  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // ✅ Adjuntos pendientes antes de enviar
  const [pendingAttachments, setPendingAttachments] = useState<LocalAttachment[]>([]);

  // ✅ Preview full-screen imagen
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);

  /**
   * ✅ Ref scroll (lista invertida)
   */
  const listRef = useRef<FlatList<UiChatMessage>>(null);
  const isAtBottomRef = useRef(true);

  /**
   * ✅ Composer height para que la lista suba igual que WhatsApp
   */
  const [composerHeight, setComposerHeight] = useState(72);

  /**
   * ✅ Base height sin teclado para cálculo robusto
   */
  const baseHeightRef = useRef(windowHeight);

  useEffect(() => {
    if (!keyboard.isVisible) {
      baseHeightRef.current = windowHeight;
    }
  }, [keyboard.isVisible, windowHeight]);

  /**
   * ✅ Si Android está haciendo resize real, no movemos bottom manual
   */
  const isSystemResizing = keyboard.isVisible && windowHeight < baseHeightRef.current - 80;

  const heightByScreenY = keyboard.screenY
    ? Math.max(0, baseHeightRef.current - keyboard.screenY)
    : 0;

  const effectiveKeyboardHeight = Math.max(keyboard.height, heightByScreenY);

  const keyboardOffset =
    keyboard.isVisible && !isSystemResizing
      ? effectiveKeyboardHeight + (Platform.OS === 'android' ? ANDROID_EMOJI_BAR_GUARD : 0)
      : 0;

  const safeBottom = Math.max(insets.bottom, 10);
  const composerBottom = keyboard.isVisible ? keyboardOffset : safeBottom;

  /**
   * ✅ UseCases (arquitectura limpia)
   */
  const chatRepo = useMemo(() => new ChatRepositoryHttp(http), [http]);
  const getMessagesUseCase = useMemo(() => new GetChatMessagesUseCase(chatRepo), [chatRepo]);
  const sendMessageUseCase = useMemo(() => new SendChatMessageUseCase(chatRepo), [chatRepo]);

  /**
   * ✅ Fondo con patrón
   */
  const PatternBackground = useCallback(() => {
    const dots = Array.from({ length: 280 });
    return (
      <View style={styles.patternLayer} pointerEvents="none">
        {dots.map((_, i) => (
          <View key={`dot-${i}`} style={styles.patternDot} />
        ))}
      </View>
    );
  }, []);

  /**
   * ✅ Navega al perfil
   */
  const openUserProfile = useCallback(() => {
    if (!peerId) return;
    navigation.navigate(Routes.UserProfile as any, {
      userId: peerId,
      displayName,
      email,
    });
  }, [peerId, navigation, displayName, email]);

  /**
   * ✅ Scroll al fondo
   */
  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated });
    });
  }, []);

  /**
   * ✅ Construye URL absoluta
   */
  const toAbsoluteUrl = useCallback((url: string): string => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${ENV.API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }, []);

  /**
   * ✅ Convierte attachments backend -> UI
   */
  const mapAttachmentsToUi = useCallback(
    (attachments?: ChatAttachment[]): { ui: UiAttachment[]; location?: OutgoingLocation } => {
      if (!attachments?.length) return { ui: [] };

      const ui: UiAttachment[] = [];
      let location: OutgoingLocation | undefined;

      for (const a of attachments) {
        if (a.kind === 'LOCATION') {
          location = {
            latitude: a.latitude,
            longitude: a.longitude,
            label: a.label ?? undefined,
          };
          continue;
        }

        // ✅ IMAGE / FILE
        ui.push({
          id: a.id,
          kind: a.kind === 'IMAGE' ? 'image' : 'file',
          uri: toAbsoluteUrl(a.url),
          name: a.fileName,
          mimeType: a.mimeType,
          size: a.fileSize,
        });
      }

      return { ui, location };
    },
    [toAbsoluteUrl],
  );

  /**
   * ✅ Convert API -> UI message
   */
  const toUiMessage = useCallback(
    (apiMsg: ApiChatMessage): UiChatMessage => {
      const createdAt = apiMsg.createdAt ? new Date(apiMsg.createdAt) : new Date();
      const isMe = apiMsg.senderId === myUserId;

      const { ui, location } = mapAttachmentsToUi(apiMsg.attachments);

      return {
        id: apiMsg.id,
        text: apiMsg.text ?? '',
        createdAt,
        from: isMe ? 'me' : 'other',
        status: isMe ? 'delivered' : undefined,
        attachments: ui.length ? ui : undefined,
        location,
      };
    },
    [mapAttachmentsToUi, myUserId],
  );

  /**
   * ✅ Envío unificado con optimistic UI
   */
  const sendWithOptimistic = useCallback(
    async (payload: { text: string; attachments?: LocalAttachment[]; location?: OutgoingLocation }) => {
      if (!peerId) return;

      const value = (payload.text ?? '').trim();
      const localAttachments = payload.attachments ?? [];
      const hasLocation = Boolean(payload.location);

      const hasAttachments = localAttachments.length > 0;
      const isEmpty = !value && !hasAttachments && !hasLocation;
      if (isEmpty) return;

      const optimisticId = `local-${Date.now()}`;

      const optimisticAttachments: UiAttachment[] = localAttachments.map((a) => ({
        id: a.id,
        kind: a.kind,
        uri: a.uri,
        name: a.name,
        mimeType: a.mimeType,
        size: a.size,
      }));

      const optimisticMsg: UiChatMessage = {
        id: optimisticId,
        text: value,
        createdAt: new Date(),
        from: 'me',
        status: 'sending',
        attachments: optimisticAttachments.length ? optimisticAttachments : undefined,
        location: payload.location,
      };

      setMessages((prev) => sortNewestFirst(uniqueByIdPreferDelivered([optimisticMsg, ...prev])));
      setIsSending(true);

      try {
        const outgoingAttachments: OutgoingAttachment[] = localAttachments.map((a) => ({
          uri: a.uri,
          name: a.name,
          mimeType: a.mimeType,
          size: a.size,
          kind: a.kind,
        }));

        const result = await sendMessageUseCase.execute(peerId, {
          text: value,
          attachments: outgoingAttachments,
          location: payload.location,
        });

        const incoming = (result.created ?? []).map((m: ApiChatMessage) => {
          const ui = toUiMessage(m);
          if (ui.from === 'me') ui.status = 'delivered';
          return ui;
        });

        setMessages((prev) => {
          const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);
          return sortNewestFirst(uniqueByIdPreferDelivered([...incoming, ...withoutOptimistic]));
        });

        if (isAtBottomRef.current) scrollToBottom(false);
      } catch (e: any) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        Alert.alert('Error', e?.message ?? 'No se pudo enviar el mensaje');
      } finally {
        setIsSending(false);
      }
    },
    [peerId, scrollToBottom, sendMessageUseCase, toUiMessage],
  );

  /**
   * ✅ Cargar historial
   */
  const loadHistory = useCallback(async () => {
    if (!peerId) return;

    setIsLoadingHistory(true);
    try {
      const history = await getMessagesUseCase.execute(peerId, 200);
      const ui = (history.messages ?? []).map(toUiMessage);

      setMessages(sortNewestFirst(uniqueByIdPreferDelivered(ui)));
      scrollToBottom(false);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo cargar el historial del chat');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [getMessagesUseCase, peerId, scrollToBottom, toUiMessage]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * ✅ Mantener último mensaje visible con teclado (WhatsApp-like)
   */
  useEffect(() => {
    if (!isAtBottomRef.current) return;
    const t = setTimeout(() => scrollToBottom(false), Platform.OS === 'ios' ? 60 : 20);
    return () => clearTimeout(t);
  }, [composerBottom, keyboard.isVisible, scrollToBottom]);

  /**
   * ✅ Polling
   */
  const isRefreshingRef = useRef(false);

  const fetchLatestMessages = useCallback(async (): Promise<UiChatMessage[]> => {
    if (!peerId) return [];
    if (isRefreshingRef.current) return [];

    isRefreshingRef.current = true;

    try {
      const latest = await getMessagesUseCase.execute(peerId, 50);
      return (latest.messages ?? []).map(toUiMessage);
    } catch {
      return [];
    } finally {
      isRefreshingRef.current = false;
    }
  }, [getMessagesUseCase, peerId, toUiMessage]);

  useFocusPolling<UiChatMessage[]>({
    enabled: Boolean(peerId),
    intervalMs: 1000,
    fetcher: fetchLatestMessages,
    onData: (latestUi) => {
      if (!latestUi.length) return;

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const onlyNew = latestUi.filter((m) => !existingIds.has(m.id));
        if (!onlyNew.length) return prev;

        if (isAtBottomRef.current) {
          requestAnimationFrame(() => scrollToBottom(false));
        }

        return sortNewestFirst(uniqueByIdPreferDelivered([...onlyNew, ...prev]));
      });
    },
  });

  /**
   * =============================================================================
   * ✅ Adjuntos (Pickers)
   * =============================================================================
   */

  const addPendingAttachments = useCallback((items: LocalAttachment[]) => {
    setPendingAttachments((prev) => {
      const merged = [...prev, ...items];
      if (merged.length > MAX_ATTACHMENTS_PER_MESSAGE) {
        return merged.slice(0, MAX_ATTACHMENTS_PER_MESSAGE);
      }
      return merged;
    });
  }, []);

  const removePendingAttachment = useCallback((id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const openAttachMenu = useCallback(() => {
    setIsAttachSheetOpen(true);
  }, []);

  const pickImagesFromGallery = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso requerido', 'Debes permitir acceso a galería.');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsMultipleSelection: true,
        selectionLimit: MAX_ATTACHMENTS_PER_MESSAGE,
      });

      if (res.canceled) return;

      const items: LocalAttachment[] = res.assets.map((a, idx) => {
        const name = a.fileName ?? `imagen_${Date.now()}_${idx}.jpg`;
        const size = (a as any).fileSize as number | undefined;

        return {
          id: `att-img-${Date.now()}-${idx}`,
          kind: 'image',
          uri: a.uri,
          name,
          mimeType: a.mimeType ?? 'image/jpeg',
          size,
          width: a.width,
          height: a.height,
        };
      });

      const tooLarge = items.find((x) => (x.size ?? 0) > MAX_FILE_SIZE_BYTES);
      if (tooLarge) {
        Alert.alert('Archivo muy grande', `Máximo permitido: 25MB.`);
        return;
      }

      addPendingAttachments(items);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo abrir la galería');
    }
  }, [addPendingAttachments]);

  const pickDocuments = useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const items: LocalAttachment[] = res.assets.map((a, idx) => ({
        id: `att-doc-${Date.now()}-${idx}`,
        kind: 'file',
        uri: a.uri,
        name: a.name,
        mimeType: a.mimeType ?? 'application/octet-stream',
        size: a.size,
      }));

      const tooLarge = items.find((x) => (x.size ?? 0) > MAX_FILE_SIZE_BYTES);
      if (tooLarge) {
        Alert.alert('Archivo muy grande', `Máximo permitido: 25MB.`);
        return;
      }

      addPendingAttachments(items);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo abrir documentos');
    }
  }, [addPendingAttachments]);

  /**
   * ✅ NUEVO: compartir ubicación como adjunto LOCATION real
   */
  const shareCurrentLocation = useCallback(async () => {
    try {
      if (!peerId) return;
      if (isSending) return;

      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Permiso requerido', 'Debes permitir ubicación para compartirla.');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationPayload: OutgoingLocation = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };

      // ✅ Envío PRO: location como attachment real
      await sendWithOptimistic({
        text: '📍 Ubicación compartida',
        attachments: [],
        location: locationPayload,
      });

      if (isAtBottomRef.current) scrollToBottom(false);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo obtener tu ubicación');
    }
  }, [isSending, peerId, scrollToBottom, sendWithOptimistic]);

  /**
   * ✅ Enviar mensaje (texto + adjuntos)
   */
  const handleSend = useCallback(async () => {
    const value = text.trim();
    if (!peerId) return;

    const hasAttachments = pendingAttachments.length > 0;
    const isEmpty = !value && !hasAttachments;
    if (isEmpty) return;

    const attachmentsToSend = [...pendingAttachments];

    // ✅ Limpieza inmediata WhatsApp
    setText('');
    setPendingAttachments([]);

    await sendWithOptimistic({ text: value, attachments: attachmentsToSend });
  }, [peerId, pendingAttachments, sendWithOptimistic, text]);

  /**
   * ✅ Abrir adjuntos
   */
  const openImage = useCallback((uri: string) => {
    setPreviewImageUri(uri);
  }, []);

  const openFile = useCallback(async (uri: string) => {
    try {
      await Linking.openURL(uri);
    } catch {
      Alert.alert('Error', 'No se pudo abrir el archivo');
    }
  }, []);

  /**
   * ✅ Render mensaje (con tarjeta de ubicación)
   */
  const renderItem = useCallback(
    ({ item }: { item: UiChatMessage }) => {
      const isMe = item.from === 'me';
      const hasAttachments = (item.attachments ?? []).length > 0;
      const hasText = (item.text ?? '').trim().length > 0;

      return (
        <View style={[styles.messageRow, isMe ? styles.messageRight : styles.messageLeft]}>
          <View style={[styles.messageStack, isMe ? styles.stackRight : styles.stackLeft]}>
            <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
              {/* ✅ Colita suave */}
              {isMe ? (
                <>
                  <View style={styles.tailBaseRight} />
                  <View style={styles.tailCutRight} />
                </>
              ) : (
                <>
                  <View style={styles.tailBaseLeft} />
                  <View style={styles.tailCutLeft} />
                </>
              )}

              {/* ✅ Ubicación como tarjeta PRO */}
              {item.location && <LocationMessageCard location={item.location} />}

              {/* ✅ Adjuntos */}
              {hasAttachments && (
                <MessageAttachments
                  attachments={item.attachments ?? []}
                  onOpenImage={openImage}
                  onOpenFile={openFile}
                />
              )}

              {/* ✅ Texto */}
              {hasText && (
                <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
                  {item.text}
                </Text>
              )}

              <View style={styles.bubbleFooter}>
                <Text style={[styles.timeInBubble, isMe ? styles.timeInBubbleMe : styles.timeInBubbleOther]}>
                  {formatTime(item.createdAt)}
                </Text>

                {isMe && (
                  <>
                    {item.status === 'sending' ? (
                      <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.85)" />
                    ) : (
                      <Ionicons
                        name="checkmark-done"
                        size={16}
                        color="rgba(255,255,255,0.90)"
                        style={styles.checkIconMe}
                      />
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    },
    [openFile, openImage],
  );

  const canSend = !(text.trim().length === 0 && pendingAttachments.length === 0);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>

            <Pressable onPress={openUserProfile} style={styles.headerProfile} hitSlop={6}>
              <AvatarCircle size={30} name={displayName} />
              <View style={styles.headerTitleWrap}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  En línea
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.headerRight}>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="call-outline" size={20} color="#fff" />
            </Pressable>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="videocam-outline" size={20} color="#fff" />
            </Pressable>
            <Pressable style={styles.headerIconBtn} hitSlop={10}>
              <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ✅ Body */}
      <View style={styles.chatBody}>
        <PatternBackground />

        <View style={styles.container}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            inverted
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            scrollEventThrottle={16}
            refreshing={isLoadingHistory}
            onRefresh={loadHistory}
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y;
              isAtBottomRef.current = y <= 25;
            }}
            onContentSizeChange={() => {
              if (isAtBottomRef.current) scrollToBottom(false);
            }}
            contentContainerStyle={[
              styles.listContent,
              {
                paddingTop: composerHeight + composerBottom + 18,
              },
            ]}
          />

          {/* ✅ Composer */}
          <View
            onLayout={(e) => setComposerHeight(e.nativeEvent.layout.height)}
            style={[
              styles.inputBar,
              {
                bottom: composerBottom,
                paddingBottom: 10,
              },
            ]}
          >
            {/* ✅ Preview adjuntos */}
            <AttachmentPreviewBar attachments={pendingAttachments} onRemove={removePendingAttachment} />

            <View style={styles.composerRow}>
              {/* 📎 Adjuntar */}
              <Pressable onPress={() => setIsAttachSheetOpen(true)} style={styles.attachBtn} hitSlop={10}>
                <Ionicons name="attach" size={18} color="#0b2b52" />
              </Pressable>

              {/* 📍 Ubicación PRO */}
              <Pressable
                onPress={shareCurrentLocation}
                disabled={isSending}
                style={[styles.attachBtn, isSending && styles.sendBtnDisabled]}
                hitSlop={10}
              >
                <Ionicons name="location-outline" size={18} color="#0b2b52" />
              </Pressable>

              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Escribe un mensaje..."
                placeholderTextColor="#6b6b6b"
                style={styles.input}
                multiline
              />

              <Pressable
                onPress={handleSend}
                disabled={!canSend || isSending}
                style={[styles.sendBtn, (!canSend || isSending) && styles.sendBtnDisabled]}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* ✅ Modal preview imagen */}
      <Modal
        visible={Boolean(previewImageUri)}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImageUri(null)}
      >
        <View style={styles.imagePreviewOverlay}>
          <Pressable style={styles.imagePreviewClose} onPress={() => setPreviewImageUri(null)} hitSlop={10}>
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>

          {previewImageUri && (
            <Image source={{ uri: previewImageUri }} style={styles.imagePreviewFull} resizeMode="contain" />
          )}
        </View>
      </Modal>

      {/* ✅ Attach Sheet estilo WhatsApp */}
      <AttachSheet
        visible={isAttachSheetOpen}
        onClose={() => setIsAttachSheetOpen(false)}
        onPickImages={pickImagesFromGallery}
        onPickDocuments={pickDocuments}
      />
    </SafeAreaView>
  );
}

/**
 * ✅ Helpers
 */
function uniqueByIdPreferDelivered(list: UiChatMessage[]): UiChatMessage[] {
  const map = new Map<string, UiChatMessage>();

  for (const msg of list) {
    const existing = map.get(msg.id);
    if (!existing) {
      map.set(msg.id, msg);
      continue;
    }

    const merged = mergeStatus(existing, msg);
    map.set(msg.id, merged);
  }

  return Array.from(map.values());
}

function mergeStatus(a: UiChatMessage, b: UiChatMessage): UiChatMessage {
  if (a.from !== 'me' && b.from !== 'me') return a;

  const rank = (s?: SendStatus) => (s === 'delivered' ? 2 : s === 'sending' ? 1 : 0);
  const best = rank(b.status) > rank(a.status) ? b : a;

  return {
    ...a,
    ...b,
    status: best.status,
  };
}

function sortNewestFirst(list: UiChatMessage[]): UiChatMessage[] {
  return [...list].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}
