import React from 'react';
import { AppProviders } from './src/app/AppProviders';

/**
 * Entry point de la app.
 * Mantiene App.tsx limpio delegando providers a un componente dedicado (SRP).
 */
export default function App() {
  return <AppProviders />;
}
