export const Routes = {
  Login: 'Login',
  Home: 'Home',

  // ✅ Nueva ruta para abrir el chat del usuario seleccionado
  Chat: 'Chat',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
