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
 * ✅ Cliente HTTP base sobre fetch
 * - Soporta JSON (default)
 * - Soporta FormData (uploads de archivos)
 * - Manejo consistente de errores (HttpError)
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

      // ✅ Detecta si estamos enviando archivos (multipart)
      const isForm = isFormData(body);

      // ✅ Si es FormData NO se debe setear Content-Type manualmente.
      // Fetch agrega el boundary automáticamente.
      const finalHeaders: Record<string, string> = {
        ...(isForm ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      };

      const finalBody =
        body === undefined ? undefined : isForm ? (body as any) : JSON.stringify(body);

      let res: Response;

      try {
        res = await fetch(url, {
          method,
          headers: finalHeaders,
          body: finalBody,
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

      // ✅ Si no es OK, convertimos a HttpError tipado
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
 * ✅ Helpers
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

/**
 * ✅ Detecta FormData de forma segura (sin romper entornos donde no exista FormData)
 */
function isFormData(body: unknown): boolean {
  // @ts-ignore
  if (typeof FormData === 'undefined') return false;
  // @ts-ignore
  return body instanceof FormData;
}
