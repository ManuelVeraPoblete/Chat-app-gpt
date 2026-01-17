import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from './HomeScreen.styles';
import { useApi } from '../../../state/api/ApiContext';

import { UsersRepositoryHttp } from '../../../data/users/UsersRepositoryHttp';
import { GetUsersUseCase } from '../../../domain/users/usecases/GetUsersUseCase';

import { HomeHeader } from './components/HomeHeader';
import { ChatListItem, type ChatRow } from './components/ChatListItem';

import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../../state/auth/AuthContext';

/**
 * ✅ Regla de negocio solicitada:
 * El primer usuario debe ser exactamente "Asistente Corporativo"
 */
const FIRST_USER_NAME = 'Asistente Corporativo';

export function HomeScreen() {
  const { http } = useApi();

  /**
   * ✅ Sesión actual (para ocultar al usuario logueado)
   */
  const { session } = useAuth();

  /**
   * ✅ Navegación tipada
   */
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * UseCase (Clean Architecture):
   * UI no sabe de HTTP ni endpoints.
   */
  const getUsersUseCase = useMemo(() => {
    const repo = new UsersRepositoryHttp(http);
    return new GetUsersUseCase(repo);
  }, [http]);

  const loadUsers = useCallback(async () => {
    setRefreshing(true);

    try {
      const users = await getUsersUseCase.execute();

      const myId = session?.user?.id;

      /**
       * ✅ Regla solicitada:
       * ❌ NO mostrar el usuario logueado en la lista
       */
      const filteredUsers = myId ? users.filter((u) => u.id !== myId) : users;

      /**
       * ✅ Convertimos usuarios de BD a filas tipo chat
       */
      const mapped: ChatRow[] = filteredUsers.map((u) => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl ?? null,
        lastMessage: 'Escríbele un mensaje…',
        lastMessageAt: new Date(),
      }));

      /**
       * ✅ Ordenar:
       * 1) "Asistente Corporativo" primero
       * 2) resto alfabético por displayName
       */
      const sorted = mapped.sort((a, b) => sortChatRows(a, b));

      setRows(sorted);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudieron cargar los usuarios desde la BD');
    } finally {
      setRefreshing(false);
    }
  }, [getUsersUseCase, session?.user?.id]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /**
   * ✅ Filtro local por nombre o email (buscador)
   */
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((u) => {
      const name = (u.displayName ?? '').toLowerCase();
      const email = (u.email ?? '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [query, rows]);

  /**
   * ✅ Abrir chat del usuario seleccionado
   */
  const handleOpenChat = useCallback(
    (user: ChatRow) => {
      navigation.navigate(Routes.Chat, {
        userId: user.id,
        displayName: user.displayName,
        email: user.email,
      });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <HomeHeader
          currentUserName="CorpChat"
          query={query}
          onChangeQuery={setQuery}
          onPressCamera={() => console.log('camera')}
          onPressNewChat={() => console.log('new chat')}
        />

        <FlatList
          data={filteredRows}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatListItem user={item} onPress={() => handleOpenChat(item)} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadUsers} />}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

/**
 * ✅ Orden solicitado
 * 1) "Asistente Corporativo" primero
 * 2) resto ordenado alfabéticamente
 */
function sortChatRows(a: ChatRow, b: ChatRow): number {
  const aIsFirst = normalizeText(a.displayName) === normalizeText(FIRST_USER_NAME);
  const bIsFirst = normalizeText(b.displayName) === normalizeText(FIRST_USER_NAME);

  if (aIsFirst && !bIsFirst) return -1;
  if (!aIsFirst && bIsFirst) return 1;

  return normalizeText(a.displayName).localeCompare(normalizeText(b.displayName), 'es', {
    sensitivity: 'base',
  });
}

/**
 * ✅ Normaliza texto para comparar sin errores por espacios/mayúsculas
 */
function normalizeText(value: string): string {
  return (value ?? '').trim().toLowerCase();
}
