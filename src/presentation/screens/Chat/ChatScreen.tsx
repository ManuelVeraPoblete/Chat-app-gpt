import React, { useCallback, useMemo, useState } from 'react';
import {
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

/**
 * ✅ Tipos del chat
 */
type ChatRoute = RouteProp<RootStackParamList, typeof Routes.Chat>;
type ChatNav = NativeStackNavigationProp<RootStackParamList>;

type ChatMessage = {
  id: string;
  text: string;
  createdAt: Date;
  from: 'me' | 'other';
};

/**
 * ✅ ChatScreen (WhatsApp style)
 * - Ajustado a SafeArea
 * - Input queda bien con teclado
 * - Mensajes demo eliminados
 * - ✅ Header sin íconos de llamada/videollamada/menú
 */
export function ChatScreen() {
  const navigation = useNavigation<ChatNav>();
  const route = useRoute<ChatRoute>();
  const insets = useSafeAreaInsets();

  const { displayName } = route.params;

  /**
   * ✅ SIN mensajes demo (arranca vacío)
   */
  const initialMessages = useMemo<ChatMessage[]>(() => [], []);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState('');

  /**
   * ✅ Enviar mensaje (solo local por ahora)
   */
  const handleSend = useCallback(() => {
    const value = text.trim();
    if (!value) return;

    const newMessage: ChatMessage = {
      id: String(Date.now()),
      text: value,
      createdAt: new Date(),
      from: 'me',
    };

    // ✅ FlatList invertida => insertamos al inicio
    setMessages((prev) => [newMessage, ...prev]);
    setText('');
  }, [text]);

  const renderItem = useCallback(({ item }: { item: ChatMessage }) => {
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
              <Text style={styles.subtitle}>En línea</Text>
            </View>
          </View>

          {/* ✅ Eliminado: videollamada, llamada y menú */}
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
              // ✅ si está vacío, centra el placeholder
              messages.length === 0 ? { flexGrow: 1 } : null,
            ]}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>
                  Aún no hay mensajes.{'\n'}Escribe el primero 👇
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

            <Pressable style={styles.sendBtn} onPress={handleSend}>
              <Ionicons name={isEmpty ? 'mic' : 'send'} size={20} color="#fff" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
