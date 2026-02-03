// src/app/AppProviders.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from '../state/auth/AuthContext';
import { ApiProvider } from '../state/api/ApiContext';
import { LocationPresenceProvider } from '../state/locations/LocationPresenceProvider';

import { AppNavigator } from '../presentation/navigation/AppNavigator';

/**
 * Providers globales:
 * AuthProvider -> ApiProvider -> LocationPresenceProvider -> Navigation
 */
export function AppProviders() {
  return (
    <AuthProvider>
      <ApiProvider>
        <LocationPresenceProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </LocationPresenceProvider>
      </ApiProvider>
    </AuthProvider>
  );
}
