import React, { createContext, useContext, useMemo } from 'react';
import type { HttpClient } from '../../core/http/HttpClient';
import { createHttpClient } from '../../core/http/HttpClient';
import { createAuthorizedHttpClient } from '../../core/http/AuthorizedHttpClient';
import { AuthRepositoryHttp } from '../../domain/auth/AuthRepositoryHttp';
import { RefreshTokensUseCase } from '../../domain/auth/usecases/RefreshTokensUseCase';
import { useAuth } from '../auth/AuthContext';

type ApiContextValue = {
  http: HttpClient;
};

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { session, updateTokens, logout } = useAuth();

  const baseHttp = useMemo(() => createHttpClient(), []);
  const authRepo = useMemo(() => new AuthRepositoryHttp(baseHttp), [baseHttp]);
  const refreshUseCase = useMemo(() => new RefreshTokensUseCase(authRepo), [authRepo]);

  const http = useMemo(() => {
    return createAuthorizedHttpClient({
      baseHttp,
      getSession: () => {
        if (!session) return null;
        return {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        };
      },
      refreshTokens: async (refreshToken: string) => refreshUseCase.execute(refreshToken),
      onTokensRefreshed: async (tokens) => {
        await updateTokens(tokens.accessToken, tokens.refreshToken);
      },
      onRefreshFailed: async () => {
        await logout();
      },
    });
  }, [
    baseHttp,
    refreshUseCase,
    session?.accessToken,
    session?.refreshToken,
    updateTokens,
    logout,
  ]);

  const value = useMemo<ApiContextValue>(() => ({ http }), [http]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi debe usarse dentro de <ApiProvider>');
  return ctx;
}
