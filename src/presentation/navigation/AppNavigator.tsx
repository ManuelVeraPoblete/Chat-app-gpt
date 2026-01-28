// src/presentation/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../../state/auth/AuthContext';
import { Routes } from './routes';

import { LoginScreen } from '../../presentation/screens/Login/LoginScreen';
import { HomeScreen } from '../../presentation/screens/Home/HomeScreen';
import { ChatScreen } from '../../presentation/screens/Chat/ChatScreen';

import UserProfileScreen from '../../presentation/screens/UserProfile/UserProfileScreen';

// ✅ NUEVO: Mapa de conectados
import { LocationsScreen } from '../../presentation/screens/Locations/LocationsScreen';

/**
 * ✅ RootStackParamList
 * Tipado de navegación para evitar errores al navegar.
 */
export type RootStackParamList = {
  [Routes.Login]: undefined;
  [Routes.Home]: undefined;

  /**
   * ✅ Chat recibe el usuario seleccionado desde Home
   */
  [Routes.Chat]: {
    userId: string; // ✅ peerId
    displayName: string;
    email?: string;
  };

  /**
   * ✅ Perfil del usuario con el que estás chateando
   * ⚠️ NO pasamos tokens por navegación (seguridad + evita bugs).
   */
  [Routes.UserProfile]: {
    userId: string;
    displayName?: string;
    email?: string;
  };

  /**
   * ✅ NUEVO: Mapa de usuarios conectados
   */
  [Routes.Locations]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * ✅ Navegación basada en estado de sesión:
 * - Si hay session => Home + Chat + UserProfile + Locations
 * - Si no => Login
 */
export function AppNavigator() {
  const { session, isBootstrapping } = useAuth();

  // ✅ Mientras se cargan tokens desde storage
  if (isBootstrapping) {
    return null;
  }

  const isAuthenticated = !!session;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name={Routes.Home} component={HomeScreen} />
          <Stack.Screen name={Routes.Chat} component={ChatScreen} />

          {/* ✅ Mapa de conectados */}
          <Stack.Screen name={Routes.Locations} component={LocationsScreen} />

          {/* ✅ Perfil con header visible */}
          <Stack.Screen
            name={Routes.UserProfile}
            component={UserProfileScreen}
            options={{
              headerShown: true,
              title: 'Perfil',
              headerStyle: { backgroundColor: '#2b69a6' },
              headerTintColor: '#fff',
            }}
          />
        </>
      ) : (
        <Stack.Screen name={Routes.Login} component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
