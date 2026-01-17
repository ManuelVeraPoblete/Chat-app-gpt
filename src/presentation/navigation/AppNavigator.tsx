import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../../state/auth/AuthContext';
import { Routes } from './routes';

import { LoginScreen } from '../../presentation/screens/Login/LoginScreen';
import { HomeScreen } from '../../presentation/screens/Home/HomeScreen';
import { ChatScreen } from '../../presentation/screens/Chat/ChatScreen';

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
    userId: string;
    displayName: string;
    email?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegación basada en estado de sesión:
 * - Si hay sesión => Home + Chat
 * - Si no => Login
 */
export function AppNavigator() {
  const { session, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    // Mantén simple (puedes poner splash)
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name={Routes.Home} component={HomeScreen} />
          <Stack.Screen name={Routes.Chat} component={ChatScreen} />
        </>
      ) : (
        <Stack.Screen name={Routes.Login} component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
