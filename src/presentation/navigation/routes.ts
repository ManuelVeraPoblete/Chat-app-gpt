export const Routes = {
  Login: 'Login',
  Home: 'Home',
  Chat: 'Chat',
  UserProfile: 'UserProfile',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
