import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useFocusPolling } from '../../../shared/hooks/useFocusPolling';
import { useKeyboard } from '../../../shared/hooks/useKeyboard';

import { styles } from './ChatScreen.styles';
import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { AvatarCircle } from '../Home/components/AvatarCircle';

import { useApi } from '../../../state/api/ApiContext';
import { useAuth } from '../../../state/auth/AuthContext';

import { ChatRepositoryHttp } from '../../../domain/chat/ChatRepositoryHttp';
import { GetChatMessagesUseCase } from '../../../domain/chat/GetChatMessagesUseCase';
import { SendChatMessageUseCase } from '../../../domain/chat/usecases/SendChatMessageUseCase';
import type { ChatMessage as ApiChatMessage } from '../../../domain/chat/entities/ChatMessage';

/**
 * ✅ Tipos de navegación
 */
type ChatRoute = RouteProp<RootStackParamList, typeof Routes.Chat>;
type ChatNav = NativeStackNavigationProp<RootStackParamList>;

/**
 * ✅ Estado visual del envío (solo para mensajes tuyos)
 */
type SendStatus = 'sending' | 'delivered';

/**
 * ✅ Tipo local para UI
 */
type UiChatMessage = {
  id: string;
  text: string;
  createdAt: Date;
  from: 'me' | 'other';

  /**
   * ✅ Solo aplica a "me"
   * - sending: muestra reloj
   * - delivered: muestra doble check ✅✅
   */
  status?: SendStatus;
};

const HEADER_HEIGHT = 46;

export function ChatScreen() {
  const navigation = useNavigation<ChatNav>();
  const route = useRoute<ChatRoute>();
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboard();

  const { http } = useApi();
  const { session } = useAuth();

  const { displayName, userId: peerId } = route.params;
  const myUserId = session?.user?.id ?? '';

  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);

  /**
   * ✅ UseCases (Clean Architecture)
   */
  const chatRepo = useMemo(() => new ChatRepositoryHttp(http), [http]);
  const getMessagesUseCase = useMemo(() => new GetChatMessagesUseCase(chatRepo), [chatRepo]);
  const sendMessageUseCase = useMemo(() => new SendChatMessageUseCase(chatRepo), [chatRepo]);

  const lastOptimisticIdRef = useRef<string | null>(null);

  /**
   * ✅ Fondo con patrón (dots)
   * - Sin imágenes externas
   */
  const PatternBackground = useCallback(() => {
    const dots = Array.from({ length: 280 }); // ✅ performance-friendly
    return (
      <View style={styles.patternLayer} pointerEvents="none">
        {dots.map((_, i) => (
          <View key={`dot-${i}`} style={styles.patternDot} />
        ))}
      </View>
    );
  }, []);

  /**
   * ✅ Abrir perfil del usuario del chat
   */
  const openUserProfile = useCallback(() => {
    if (!peerId) return;

    const accessToken =
      (session as any)?.accessToken ??
      (session as any)?.tokens?.accessToken ??
      (session as any)?.jwt?.accessToken ??
      '';

    if (!accessToken) {
      Alert.alert('Sesión', 'Tu sesión expiró. Vuelve a iniciar sesión.');
      return;
    }

    navigation.navigate(Routes.UserProfile, {
      userId: peerId,
      displayName,
      email: route.params.email,
    } as any);
  }, [peerId, session, navigation, displayName, route.params.email]);

  /**
   * ✅ Convertir API -> UI
   */
  const toUiMessage = useCallback(
    (apiMsg: ApiChatMessage): UiChatMessage => {
      const createdAt = apiMsg.createdAt ? new Date(apiMsg.createdAt) : new Date();
      const isMe = apiMsg.senderId === myUserId;

      return {
        id: apiMsg.id,
        text: apiMsg.text,
        createdAt,
        from: isMe ? 'me' : 'other',

        // ✅ Historial / backend => consideramos entregado
        status: isMe ? 'delivered' : undefined,
      };
    },
    [myUserId]
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
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo cargar el historial del chat');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [getMessagesUseCase, peerId, toUiMessage]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /**
   * ✅ Polling de mensajes (sin WebSockets)
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

        return sortNewestFirst(uniqueByIdPreferDelivered([...onlyNew, ...prev]));
      });
    },
  });

  /**
   * ✅ Enviar mensaje (optimista)
   */
  const handleSend = useCallback(async () => {
    const value = text.trim();
    if (!value || !peerId) return;

    const optimisticId = `local-${Date.now()}`;
    lastOptimisticIdRef.current = optimisticId;

    const optimisticMsg: UiChatMessage = {
      id: optimisticId,
      text: value,
      createdAt: new Date(),
      from: 'me',
      status: 'sending', // ✅ reloj mientras llega respuesta
    };

    setMessages((prev) => sortNewestFirst(uniqueByIdPreferDelivered([optimisticMsg, ...prev])));
    setText('');
    setIsSending(true);

    try {
      const result = await sendMessageUseCase.execute(peerId, value);

      // ✅ Backend devuelve newest-first (assistant + user)
      const incoming = (result.created ?? []).map((m: ApiChatMessage) => {
        const ui = toUiMessage(m);

        // ✅ todo lo que venga del backend se considera delivered
        if (ui.from === 'me') ui.status = 'delivered';
        return ui;
      });

      setMessages((prev) => {
        // ✅ Remueve optimista y agrega lo real
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);
        return sortNewestFirst(uniqueByIdPreferDelivered([...incoming, ...withoutOptimistic]));
      });
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo enviar el mensaje');
    } finally {
      setIsSending(false);
    }
  }, [peerId, sendMessageUseCase, text, toUiMessage]);

  /**
   * ✅ Render mensaje:
   * ✅ colita suave
   * ✅ hora dentro
   * ✅ check ✅✅ / reloj
   */
  const renderItem = useCallback(({ item }: { item: UiChatMessage }) => {
    const isMe = item.from === 'me';

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

            {/* ✅ Texto */}
            <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
              {item.text}
            </Text>

            {/* ✅ Footer dentro de burbuja */}
            <View style={styles.bubbleFooter}>
              <Text
                style={[
                  styles.timeInBubble,
                  isMe ? styles.timeInBubbleMe : styles.timeInBubbleOther,
                ]}
              >
                {formatTime(item.createdAt)}
              </Text>

              {/* ✅ Checks solo para mensajes tuyos */}
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
  }, []);

  const isEmpty = text.trim().length === 0;

  /**
   * ✅ iOS offset teclado (top + header)
   */
  const keyboardOffset = Platform.OS === 'ios' ? insets.top + HEADER_HEIGHT : 0;

  /**
   * ✅ ANDROID FIX:
   * Empujar el contenido cuando aparece el teclado (Android físico)
   */
  const androidKeyboardPadding = Platform.OS === 'android' && keyboard.isVisible ? keyboard.height : 0;

  const inputBottomPadding = Math.max(insets.bottom, 10);

  const RootContainer = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const rootProps =
    Platform.OS === 'ios'
      ? { behavior: 'padding' as const, keyboardVerticalOffset: keyboardOffset }
      : {};

  return (
    <SafeAreaView style={styles.safe}>
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
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                  {displayName}
                </Text>
                <Text style={styles.headerSubtitle} numberOfLines={1} ellipsizeMode="tail">
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

      {/* ✅ Contenido */}
      <RootContainer style={{ flex: 1 }} {...(rootProps as any)}>
        <View style={[styles.chatBody, { paddingBottom: androidKeyboardPadding }]}>
          {/* ✅ Patrón */}
          <PatternBackground />

          <View style={styles.container}>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              inverted
              contentContainerStyle={styles.listContent}
              refreshing={isLoadingHistory}
              onRefresh={loadHistory}
              keyboardShouldPersistTaps="handled"
            />

            {/* ✅ Input */}
            <View style={[styles.inputBar, { paddingBottom: inputBottomPadding }]}>
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
                disabled={isEmpty || isSending}
                style={[styles.sendBtn, (isEmpty || isSending) && styles.sendBtnDisabled]}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </RootContainer>
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

    // ✅ Prioridad de estado: delivered > sending
    const merged = mergeStatus(existing, msg);
    map.set(msg.id, merged);
  }

  return Array.from(map.values());
}

function mergeStatus(a: UiChatMessage, b: UiChatMessage): UiChatMessage {
  // Si alguno no es "me", devolalls el más completo
  if (a.from !== 'me' && b.from !== 'me') return a;

  const rank = (s?: SendStatus) => (s === 'delivered' ? 2 : s === 'sending' ? 1 : 0);

  // Preferimos el que tenga status más alto
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

/**
 * ✅ Hora en formato HH:mm (ej: 12:35)
 */
function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}
