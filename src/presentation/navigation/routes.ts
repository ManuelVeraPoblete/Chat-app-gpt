export const Routes = {
  Login: 'Login',
  Home: 'Home',
  Chat: 'Chat',
  UserProfile: 'UserProfile',

  // ✅ NUEVO: pantalla de geolocalización (mapa de conectados)
  Locations: 'Locations',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
