import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
 * - Conecta con API NestJS:
 *   GET  /chat/:peerId/messages
 *   POST /chat/:peerId/messages
 * - Renderiza mensajes del usuario + respuesta del asistente cuando corresponda
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
   * ✅ UseCases (Clean Architecture):
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
   * ✅ Convierte mensaje de API -> UI
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

      // Backend devuelve newest-first => ideal para FlatList inverted
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
   * ✅ Enviar mensaje a la API
   * - Inserta optimista el mensaje del usuario
   * - POST /chat/:peerId/messages
   * - Inserta los mensajes creados por el backend (incluye assistant si corresponde)
   */
  const handleSend = useCallback(async () => {
    const value = text.trim();
    if (!value || !peerId) return;

    // ✅ Optimista: aparece altiro
    const optimisticId = `local-${Date.now()}`;
    lastOptimisticIdRef.current = optimisticId;

    const optimisticMsg: UiChatMessage = {
      id: optimisticId,
      text: value,
      createdAt: new Date(),
      from: 'me',
    };

    // FlatList invertida => insertamos al inicio
    setMessages((prev) => sortNewestFirst(uniqueById([optimisticMsg, ...prev])));
    setText('');

    setIsSending(true);

    try {
      const result = await sendMessageUseCase.execute(peerId, value);

      // Backend devuelve newest-first (assistant + user)
      const incoming = (result.created ?? []).map(toUiMessage);

      setMessages((prev) => {
        // ✅ Remueve el optimista para evitar duplicado
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);

        // ✅ Agrega lo que viene del backend (incluye assistant)
        return sortNewestFirst(uniqueById([...incoming, ...withoutOptimistic]));
      });
    } catch (e: any) {
      // ✅ Si falla, dejamos el optimista visible (útil para debug)
      Alert.alert('Error', e?.message ?? 'No se pudo enviar el mensaje');
    } finally {
      setIsSending(false);
    }
  }, [peerId, sendMessageUseCase, text, toUiMessage]);

  const renderItem = useCallback(({ item }: { item: UiChatMessage }) => {
    const isMe = item.from === 'me';

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRight : styles.messageLeft]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  }, []);

  const isEmpty = text.trim().length === 0;

  /**
   * ✅ Header height dinámico según SafeArea
   */
  const headerHeight = 58 + insets.top;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* ✅ HEADER (solo back + avatar + nombre) */}
        <View style={[styles.header, { height: headerHeight, paddingTop: insets.top }]}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable>

            <AvatarCircle name={displayName} size={36} badge="online" />

            <View style={styles.titleWrap}>
              <Text numberOfLines={1} style={styles.title}>
                {displayName}
              </Text>

              {/* ✅ Señal simple de estado */}
              <Text style={styles.subtitle}>{isLoadingHistory ? 'Cargando…' : 'En línea'}</Text>
            </View>
          </View>
        </View>

        {/* ✅ BODY ajustado a teclado */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
        >
          {/* ✅ MENSAJES */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            inverted
            style={styles.messagesList}
            contentContainerStyle={[
              styles.messagesContent,
              messages.length === 0 ? { flexGrow: 1 } : null,
            ]}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>
                  Aún no hay mensajes.{"\n"}Escribe el primero 👇
                </Text>
              </View>
            }
          />

          {/* ✅ INPUT (respeta SafeArea Bottom) */}
          <View style={[styles.inputWrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <View style={styles.inputCard}>
              <Pressable style={styles.smallIcon}>
                <Ionicons name="happy-outline" size={22} color="#6b7280" />
              </Pressable>

              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Message"
                placeholderTextColor="#9ca3af"
                style={styles.input}
                multiline
              />

              <Pressable style={styles.smallIcon}>
                <Ionicons name="attach-outline" size={22} color="#6b7280" />
              </Pressable>

              <Pressable style={styles.smallIcon}>
                <Ionicons name="camera-outline" size={22} color="#6b7280" />
              </Pressable>
            </View>

            <Pressable
              style={[styles.sendBtn, isSending ? { opacity: 0.7 } : null]}
              onPress={handleSend}
              disabled={isSending}
            >
              <Ionicons name={isEmpty ? 'mic' : 'send'} size={20} color="#fff" />
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
