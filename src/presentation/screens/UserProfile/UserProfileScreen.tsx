import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { styles } from './UserProfileScreen.styles';
import { getApiBaseUrl } from '../../../shared/config/apiBaseUrl';

/**
 * ✅ Modelo público del usuario (lo que devuelve GET /users/:id)
 */
type PublicUser = {
  id: string;
  email: string;
  displayName: string;

  phone?: string | null;
  companySection?: string | null;
  jobTitle?: string | null;

  createdAt?: string;
};

/**
 * ✅ UserProfileScreen
 * - Muestra datos del usuario con quien estás chateando
 * - Backend: GET /users/:id (JWT)
 */
export default function UserProfileScreen() {
  const route = useRoute<any>();

  const userId: string = route?.params?.userId;
  const accessToken: string = route?.params?.accessToken;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ URL base automática (Android emulator / iOS simulator / físico)
   */
  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) throw new Error('userId no fue enviado a la pantalla de perfil');
        if (!accessToken) throw new Error('Token inválido o sesión expirada');

        const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Error al obtener perfil: ${res.status} - ${errText}`);
        }

        const data: PublicUser = await res.json();

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
  }, [API_BASE_URL, accessToken, userId]);

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
      </View>
    </ScrollView>
  );
}
