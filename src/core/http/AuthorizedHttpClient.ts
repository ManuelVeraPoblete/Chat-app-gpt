import type { HttpClient, HttpMethod } from './HttpClient';
import { HttpError } from './HttpError';

type SessionLike = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshResult = {
  accessToken: string;
  refreshToken?: string;
};

type Params = {
  baseHttp: HttpClient;

  /**
   * Getter para leer tokens actuales sin acoplar a React.
   */
  getSession: () => SessionLike | null;

  /**
   * Llama al backend para refrescar tokens.
   */
  refreshTokens: (refreshToken: string) => Promise<RefreshResult>;

  /**
   * Actualiza tokens en estado/persistencia.
   */
  onTokensRefreshed: (tokens: RefreshResult) => Promise<void> | void;

  /**
   * Qué hacer cuando refresh falla: normalmente logout.
   */
  onRefreshFailed: () => Promise<void> | void;
};

/**
 * Decorador HttpClient:
 * - Agrega Authorization automáticamente
 * - Si recibe 401 => refresh => reintento 1 vez
 * - Controla concurrencia: 1 refresh a la vez
 */
export function createAuthorizedHttpClient(params: Params): HttpClient {
  let refreshInFlight: Promise<RefreshResult> | null = null;

  async function ensureFreshTokens(): Promise<RefreshResult> {
    const session = params.getSession();
    if (!session?.refreshToken) {
      throw new Error('No existe refreshToken para refrescar sesión');
    }

    // Evita múltiples refresh simultáneos
    if (!refreshInFlight) {
      refreshInFlight = params
        .refreshTokens(session.refreshToken)
        .then(async (tokens) => {
          await params.onTokensRefreshed(tokens);
          return tokens;
        })
        .finally(() => {
          refreshInFlight = null;
        });
    }

    return refreshInFlight;
  }

  // 👇 Clave: amarramos el objeto al tipo HttpClient (evita any implícito)
  const client: HttpClient = {
    async request<TResponse, TBody = unknown>(
      path: string,
      method: HttpMethod,
      body?: TBody,
      headers: Record<string, string> = {}
    ): Promise<TResponse> {
      const session = params.getSession();

      // Si no hay sesión, request normal sin auth (y sin refresh)
      if (!session?.accessToken) {
        return params.baseHttp.request<TResponse, TBody>(path, method, body, headers);
      }

      try {
        // 1) Request con Authorization
        return await params.baseHttp.request<TResponse, TBody>(path, method, body, {
          Authorization: `Bearer ${session.accessToken}`,
          ...headers,
        });
      } catch (err) {
        // Solo manejamos 401 reales
        if (!(err instanceof HttpError)) throw err;
        if (err.status !== 401) throw err;

        // 2) refresh y reintento 1 vez
        try {
          const tokens = await ensureFreshTokens();

          return await params.baseHttp.request<TResponse, TBody>(path, method, body, {
            Authorization: `Bearer ${tokens.accessToken}`,
            ...headers,
          });
        } catch {
          // 3) refresh falló => logout
          await params.onRefreshFailed();
          throw err;
        }
      }
    },
  };

  return client;
}
