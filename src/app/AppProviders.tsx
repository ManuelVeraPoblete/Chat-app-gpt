import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../state/auth/AuthContext';
import { ApiProvider } from '../state/api/ApiContext';
import { AppNavigator } from '../presentation/navigation/AppNavigator';

/**
 * Providers globales:
 * AuthProvider -> ApiProvider (necesita tokens) -> Navigation
 */
export function AppProviders() {
  return (
    <AuthProvider>
      <ApiProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ApiProvider>
    </AuthProvider>
  );
}
