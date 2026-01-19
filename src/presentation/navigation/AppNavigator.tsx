import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../../state/auth/AuthContext';
import { Routes } from './routes';

import { LoginScreen } from '../../presentation/screens/Login/LoginScreen';
import { HomeScreen } from '../../presentation/screens/Home/HomeScreen';
import { ChatScreen } from '../../presentation/screens/Chat/ChatScreen';

// ✅ NUEVO: pantalla de perfil del usuario
import UserProfileScreen from '../../presentation/screens/UserProfile/UserProfileScreen';

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
    userId: string; // ✅ peerId (usuario con el que chateas)
    displayName: string;
    email?: string;
  };

  /**
   * ✅ NUEVO: Perfil del usuario con el que estás chateando
   * - userId: ID del usuario a consultar
   * - accessToken: token JWT necesario para llamar GET /users/:id
   * - displayName: opcional para mostrar en header si quieres
   */
  [Routes.UserProfile]: {
    userId: string;
    accessToken: string;
    displayName?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegación basada en estado de sesión:
 * - Si hay sesión => Home + Chat + UserProfile
 * - Si no => Login
 */
export function AppNavigator() {
  const { session, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    // ✅ Mantén simple (puedes poner SplashScreen si quieres)
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name={Routes.Home} component={HomeScreen} />
          <Stack.Screen name={Routes.Chat} component={ChatScreen} />

          {/* ✅ NUEVO: Perfil Usuario */}
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
