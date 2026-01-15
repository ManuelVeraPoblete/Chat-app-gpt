export const Routes = {
  Login: 'Login',
  Home: 'Home',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
