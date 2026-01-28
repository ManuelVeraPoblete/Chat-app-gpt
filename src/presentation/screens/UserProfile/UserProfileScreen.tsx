// src/presentation/screens/UserProfile/UserProfileScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { styles } from './UserProfileScreen.styles';
import { Routes } from '../../navigation/routes';
import type { RootStackParamList } from '../../navigation/AppNavigator';

import { useApi } from '../../../state/api/ApiContext';
import { useAuth } from '../../../state/auth/AuthContext';

import { UsersRepositoryHttp } from '../../../data/users/UsersRepositoryHttp';
import { GetUserProfileUseCase } from '../../../domain/users/usecases/GetUserProfileUseCase';
import type { UserProfile } from '../../../domain/users/entities/UserProfile';

/**
 * ✅ Tipos de navegación (evita any)
 */
type UserProfileRoute = RouteProp<RootStackParamList, typeof Routes.UserProfile>;

/**
 * ✅ UserProfileScreen
 * - Muestra datos del usuario con quien estás chateando
 * - Backend: GET /users/:id (JWT)
 *
 * Importante:
 * - NO pasamos el token por navegación (seguridad + evita bugs).
 * - Usamos ApiContext (AuthorizedHttpClient) que agrega JWT + refresh automático.
 */
export default function UserProfileScreen() {
  const route = useRoute<UserProfileRoute>();

  const { http } = useApi();
  const { session } = useAuth();

  const userId = route.params?.userId;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ UseCase (arquitectura limpia)
   */
  const getUserProfileUseCase = useMemo(() => {
    const repo = new UsersRepositoryHttp(http);
    return new GetUserProfileUseCase(repo);
  }, [http]);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Validaciones mínimas
        if (!userId) throw new Error('userId no fue enviado a la pantalla de perfil');

        // Si no hay sesión, el AuthorizedHttpClient no pondrá Authorization.
        // Esto suele ocurrir si expiró y el refresh falló => logout.
        if (!session?.accessToken) throw new Error('Token inválido o sesión expirada');

        const data = await getUserProfileUseCase.execute(userId);

        if (mounted) setUser(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'No se pudo cargar el perfil');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [getUserProfileUseCase, session?.accessToken, userId]);

  // ✅ Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.centerText}>Cargando perfil...</Text>
      </View>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>No se pudo cargar</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // ✅ Empty
  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Perfil no disponible</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ✅ Card principal */}
      <View style={styles.card}>
        <Text style={styles.title}>{user.displayName}</Text>
        <Text style={styles.subtitle}>{user.email}</Text>
      </View>

      {/* ✅ Datos Corporativos */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Datos Corporativos</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{user.phone ?? 'No informado'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Sección</Text>
          <Text style={styles.value}>{user.companySection ?? 'No informado'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Cargo</Text>
          <Text style={styles.value}>{user.jobTitle ?? 'No informado'}</Text>
        </View>

        {/* ✅ Opcionales */}
        {'status' in user ? (
          <View style={styles.row}>
            <Text style={styles.label}>Estado</Text>
            <Text style={styles.value}>{user.status ?? 'No informado'}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
