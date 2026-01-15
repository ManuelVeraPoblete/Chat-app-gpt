import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../../state/auth/AuthContext';
import { Routes } from './routes';
import { LoginScreen } from '../../presentation/screens/Login/LoginScreen';
import { HomeScreen } from '../../presentation/screens/Home/HomeScreen';

export type RootStackParamList = {
  [Routes.Login]: undefined;
  [Routes.Home]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegación basada en estado de sesión:
 * - Si hay sesión => Home
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
        <Stack.Screen name={Routes.Home} component={HomeScreen} />
      ) : (
        <Stack.Screen name={Routes.Login} component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
