import { ENV } from '../config/env';
import { HttpError } from './HttpError';

/**
 * Métodos HTTP soportados por el cliente.
 * Se exporta para que otros módulos (AuthorizedHttpClient) tipen correctamente.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpClient = {
  request<TResponse, TBody = unknown>(
    path: string,
    method: HttpMethod,
    body?: TBody,
    headers?: Record<string, string>
  ): Promise<TResponse>;
};

/**
 * Cliente HTTP base sobre fetch:
 * - Tipado genérico
 * - Manejo consistente de errores
 */
export function createHttpClient(baseUrl: string = ENV.API_BASE_URL): HttpClient {
  // ✅ Normalizamos baseUrl por seguridad (sin slash final)
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  const client: HttpClient = {
    async request<TResponse, TBody = unknown>(
      path: string,
      method: HttpMethod,
      body?: TBody,
      headers: Record<string, string> = {}
    ): Promise<TResponse> {
      const url = buildUrl(normalizedBaseUrl, path);

      let res: Response;
      try {
        res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body !== undefined ? JSON.stringify(body) : undefined,
        });
      } catch (e: any) {
        // ✅ Este catch resuelve el típico: "Network request failed"
        // (Android físico llamando a localhost, backend no accesible, firewall, etc.)
        throw new HttpError(
          `Network request failed al llamar ${url}. ` +
            `Revisa que tu API esté escuchando en 0.0.0.0 y que la URL base sea correcta (ej: http://192.168.1.28:3000).`,
          0,
          {
            cause: e?.message ?? String(e),
            url,
          }
        );
      }

      const text = await res.text();
      const payload = text ? safeJsonParse(text) : undefined;

      if (!res.ok) {
        const message =
          (payload as any)?.message ||
          (payload as any)?.error ||
          `HTTP ${res.status} al llamar ${path}`;

        throw new HttpError(message, res.status, payload);
      }

      return payload as TResponse;
    },
  };

  return client;
}

/**
 * ✅ Asegura que baseUrl no termine en slash.
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

/**
 * ✅ Asegura que path comience con slash.
 */
function buildUrl(baseUrl: string, path: string): string {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${safePath}`;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
