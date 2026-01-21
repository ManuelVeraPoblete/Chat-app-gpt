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
 * ✅ Tipo local para UI.
 * El backend entrega role/senderId, acá lo simplificamos a 'me' | 'other'.
 */
type UiChatMessage = {
  id: string;
  text: string;
  createdAt: Date;
  from: 'me' | 'other';
};

/**
 * ✅ ChatScreen (WhatsApp style)
 * - GET  /chat/:peerId/messages
 * - POST /chat/:peerId/messages
 *
 * Incluye:
 * ✅ Auto-refresh con polling mientras la pantalla está activa (sin websockets)
 * ✅ Header compacto estilo WhatsApp
 */
export function ChatScreen() {
  const navigation = useNavigation<ChatNav>();
  const route = useRoute<ChatRoute>();
  const insets = useSafeAreaInsets();

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
   * UI no conoce endpoints, solo casos de uso.
   */
  const chatRepo = useMemo(() => new ChatRepositoryHttp(http), [http]);
  const getMessagesUseCase = useMemo(() => new GetChatMessagesUseCase(chatRepo), [chatRepo]);
  const sendMessageUseCase = useMemo(() => new SendChatMessageUseCase(chatRepo), [chatRepo]);

  /**
   * ✅ Ref para controlar el último mensaje optimista
   * (evita duplicados cuando el backend retorna el mismo mensaje con un ID real)
   */
  const lastOptimisticIdRef = useRef<string | null>(null);

  /**
   * ✅ Abrir perfil del usuario con el que estás chateando
   */
  const openUserProfile = useCallback(() => {
    if (!peerId) return;

    // ✅ Recuperamos accessToken desde la sesión (según como lo tengas guardado)
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
   * ✅ Convertir mensaje API -> UI
   */
  const toUiMessage = useCallback(
    (apiMsg: ApiChatMessage): UiChatMessage => {
      const createdAt = apiMsg.createdAt ? new Date(apiMsg.createdAt) : new Date();
      const from = apiMsg.senderId === myUserId ? 'me' : 'other';

      return {
        id: apiMsg.id,
        text: apiMsg.text,
        createdAt,
        from,
      };
    },
    [myUserId]
  );

  /**
   * ✅ Carga historial al entrar a la pantalla
   */
  const loadHistory = useCallback(async () => {
    if (!peerId) return;

    setIsLoadingHistory(true);

    try {
      const history = await getMessagesUseCase.execute(peerId, 200);

      // ✅ Backend devuelve newest-first => ideal para FlatList inverted
      const ui = (history.messages ?? []).map(toUiMessage);
      setMessages(sortNewestFirst(uniqueById(ui)));
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
   * ✅ Auto-refresh del chat (SIN WebSocket)
   * - Trae mensajes cada X ms SOLO cuando la pantalla está enfocada
   * - Mezcla mensajes nuevos sin duplicar
   */
  const isRefreshingRef = useRef(false);

  const fetchLatestMessages = useCallback(async (): Promise<UiChatMessage[]> => {
    if (!peerId) return [];

    // ✅ Evita llamadas concurrentes
    if (isRefreshingRef.current) return [];
    isRefreshingRef.current = true;

    try {
      // ✅ Traemos últimos 50 mensajes para detectar nuevos
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
    intervalMs: 1000, // ✅ Puedes bajar a 800 si lo quieres más instantáneo
    fetcher: fetchLatestMessages,
    onData: (latestUi) => {
      if (!latestUi.length) return;

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const onlyNew = latestUi.filter((m) => !existingIds.has(m.id));

        if (!onlyNew.length) return prev;

        return sortNewestFirst(uniqueById([...onlyNew, ...prev]));
      });
    },
  });

  /**
   * ✅ Enviar mensaje
   * - Inserta optimista
   * - Envía al backend
   * - Inserta lo retornado por backend (incluye assistant)
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
    };

    // ✅ FlatList invertida => insertamos al inicio
    setMessages((prev) => sortNewestFirst(uniqueById([optimisticMsg, ...prev])));
    setText('');

    setIsSending(true);

    try {
      const result = await sendMessageUseCase.execute(peerId, value);

      // ✅ Backend devuelve newest-first (assistant + user)
      const incoming = (result.created ?? []).map(toUiMessage);

      setMessages((prev) => {
        // ✅ Remueve el optimista para evitar duplicado
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);

        // ✅ Agrega lo que viene del backend
        return sortNewestFirst(uniqueById([...incoming, ...withoutOptimistic]));
      });
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo enviar el mensaje');
    } finally {
      setIsSending(false);
    }
  }, [peerId, sendMessageUseCase, text, toUiMessage]);

  /**
   * ✅ Render mensaje
   * - Texto blanco cuando es burbuja azul (me)
   * - Texto oscuro cuando es burbuja blanca (other)
   */
  const renderItem = useCallback(({ item }: { item: UiChatMessage }) => {
    const isMe = item.from === 'me';

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRight : styles.messageLeft]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  }, []);

  const isEmpty = text.trim().length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ✅ Header compacto estilo WhatsApp */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={10}
            >
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </Pressable>

            <Pressable
              onPress={openUserProfile}
              style={styles.headerProfile}
              hitSlop={6}
            >
              <AvatarCircle size={34} name={displayName} />

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

      {/* ✅ Lista de mensajes */}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <View style={styles.inputBar}>
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
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

/**
 * ✅ Helpers
 */
function uniqueById(list: UiChatMessage[]): UiChatMessage[] {
  const map = new Map<string, UiChatMessage>();

  for (const m of list) {
    if (!map.has(m.id)) map.set(m.id, m);
  }

  return Array.from(map.values());
}

function sortNewestFirst(list: UiChatMessage[]): UiChatMessage[] {
  return [...list].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
