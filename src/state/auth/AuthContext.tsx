import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createHttpClient } from '../../core/http/HttpClient';
import { AuthRepositoryHttp } from '../../domain/auth/AuthRepositoryHttp';
import { LoginUseCase } from '../../domain/auth/usecases/LoginUseCase';
import { authStorage } from '../../domain/auth/authStorage';
import type { Session } from './types';

/**
 * ✅ Tipo exportado (para que NO exista otro AuthContextValue distinto en el proyecto)
 */
export type AuthContextValue = {
  session: Session | null;
  isBootstrapping: boolean;

  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;

  /**
   * ✅ Debe existir sí o sí para el refresh automático
   */
  updateTokens(accessToken: string, refreshToken?: string): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // DI simple para login
  const loginUseCase = useMemo(() => {
    const http = createHttpClient();
    const repo = new AuthRepositoryHttp(http);
    return new LoginUseCase(repo);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await authStorage.getSession();
        setSession(stored);
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUseCase.execute(email, password);

      const newSession: Session = {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };

      setSession(newSession);
      await authStorage.saveSession(newSession);
    },
    [loginUseCase]
  );

  const logout = useCallback(async () => {
    setSession(null);
    await authStorage.clear();
  }, []);

  /**
   * ✅ Actualiza tokens y persiste (usado por AuthorizedHttpClient)
   */
  const updateTokens = useCallback(async (accessToken: string, refreshToken?: string) => {
    let next: Session | null = null;

    setSession((prev) => {
      if (!prev) return prev;

      next = {
        ...prev,
        accessToken,
        refreshToken: refreshToken ?? prev.refreshToken,
      };

      return next;
    });

    if (next) {
      await authStorage.saveSession(next);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isBootstrapping,
      login,
      logout,
      updateTokens,
    }),
    [session, isBootstrapping, login, logout, updateTokens]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
