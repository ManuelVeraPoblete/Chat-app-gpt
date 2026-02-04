// src/presentation/screens/Home/HomeScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { styles } from './HomeScreen.styles';
import { useApi } from '../../../state/api/ApiContext';
import { useAuth } from '../../../state/auth/AuthContext';

import { UsersRepositoryHttp } from '../../../data/users/UsersRepositoryHttp';
import { GetUsersUseCase } from '../../../domain/users/usecases/GetUsersUseCase';

// ✅ IMPORT CORRECTO (ARREGLA EL ERROR)
import { ChatRepositoryHttp } from '../../../domain/chat/ChatRepositoryHttp';
import { GetUnreadCountsUseCase } from '../../../domain/chat/usecases/GetUnreadCountsUseCase';

import { HomeHeader } from './components/HomeHeader';
import { ChatListItem, type ChatRow } from './components/ChatListItem';

import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/AppNavigator';

/**
 * ✅ Regla de negocio:
 * El primer usuario debe ser el asistente corporativo
 */
const FIRST_USER_NAME = 'Asistente Corporativo';

export function HomeScreen() {
  const { http } = useApi();
  const { session, logout } = useAuth();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // ==============================
  // ✅ USE CASES (Clean Architecture)
  // ==============================
  const getUsersUseCase = useMemo(() => {
    return new GetUsersUseCase(new UsersRepositoryHttp(http));
  }, [http]);

  const getUnreadCountsUseCase = useMemo(() => {
    return new GetUnreadCountsUseCase(new ChatRepositoryHttp(http));
  }, [http]);

  // ==============================
  // ✅ CARGA PRINCIPAL
  // ==============================
  const loadUsers = useCallback(async () => {
    setRefreshing(true);

    try {
      const users = await getUsersUseCase.execute();
      const myId = session?.user?.id;

      const filtered = myId ? users.filter((u) => u.id !== myId) : users;

      const mapped: ChatRow[] = filtered.map((u) => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl ?? null,
        lastMessage:
          [u.companySection, u.jobTitle].filter(Boolean).join(' • ') ||
          u.phone ||
          'Sin información',
        lastMessageAt: new Date(),
        unreadCount: 0,
      }));

      const sorted = mapped.sort(sortChatRows);

      // ✅ USO CORRECTO DEL USE CASE
      const counts = await getUnreadCountsUseCase.execute(
        sorted.map((r) => r.id),
      );

      setRows(
        sorted.map((r) => ({
          ...r,
          unreadCount: Number(counts?.[r.id] ?? 0),
        })),
      );
    } catch (e: any) {
      Alert.alert(
        'Error',
        e?.message ?? 'No se pudieron cargar los usuarios',
      );
    } finally {
      setRefreshing(false);
    }
  }, [getUsersUseCase, getUnreadCountsUseCase, session?.user?.id]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers]),
  );

  // ==============================
  // ✅ FILTRO LOCAL
  // ==============================
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [query, rows]);

  // ==============================
  // ✅ HANDLERS
  // ==============================
  const handleOpenChat = useCallback(
    (user: ChatRow) => {
      navigation.navigate(Routes.Chat, {
        userId: user.id,
        displayName: user.displayName,
        email: user.email,
      });
    },
    [navigation],
  );

  const handleOpenLocations = useCallback(() => {
    navigation.navigate(Routes.Locations);
  }, [navigation]);

  const handleLogout = useCallback(() => {
    Alert.alert('Cerrar sesión', '¿Deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  }, [logout]);

  // ==============================
  // ✅ RENDER
  // ==============================
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <HomeHeader
          currentUserName="CorpChat"
          query={query}
          onChangeQuery={setQuery}
          onPressLocations={handleOpenLocations}
          onPressLogout={handleLogout}
        />

        <FlatList
          data={filteredRows}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem user={item} onPress={() => handleOpenChat(item)} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadUsers} />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

// ==============================
// ✅ UTILIDADES
// ==============================
function sortChatRows(a: ChatRow, b: ChatRow): number {
  const aIsFirst =
    a.displayName.trim().toLowerCase() ===
    FIRST_USER_NAME.toLowerCase();
  const bIsFirst =
    b.displayName.trim().toLowerCase() ===
    FIRST_USER_NAME.toLowerCase();

  if (aIsFirst && !bIsFirst) return -1;
  if (!aIsFirst && bIsFirst) return 1;

  return a.displayName.localeCompare(b.displayName, 'es', {
    sensitivity: 'base',
  });
}
