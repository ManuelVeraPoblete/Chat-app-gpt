import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createHttpClient } from '../../core/http/HttpClient';
import { AuthRepositoryHttp } from './AuthRepositoryHttp';
import { LoginUseCase } from '../../domain/auth/usecases/LoginUseCase';
import { authStorage } from './authStorage';
import type { AuthActions, AuthState, Session } from './types';

/**
 * Context tipado para autenticación:
 * - Mantiene sesión (user + tokens)
 * - Persiste sesión en AsyncStorage
 */
type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // Composición de dependencias (DI simple)
  const loginUseCase = useMemo(() => {
    const http = createHttpClient();
    const repo = new AuthRepositoryHttp(http);
    return new LoginUseCase(repo);
  }, []);

  useEffect(() => {
    // Bootstrap: carga sesión persistida
    (async () => {
      try {
        const stored = await authStorage.getSession();
        setSession(stored);
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      session,
      isBootstrapping,

      login: async (email: string, password: string) => {
        const result = await loginUseCase.execute(email, password);

        // Mapeo exacto según respuesta de backend
        const newSession: Session = {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        };

        setSession(newSession);
        await authStorage.saveSession(newSession);
      },

      logout: async () => {
        setSession(null);
        await authStorage.clear();
      },
    }),
    [session, isBootstrapping, loginUseCase]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook seguro para consumir AuthContext.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
