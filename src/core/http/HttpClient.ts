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
 * ✅ Tipado genérico
 * ✅ Manejo consistente de errores
 * ✅ Soporta JSON y FormData (multipart)
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

      /**
       * ✅ Detectar si body es FormData (para uploads tipo WhatsApp)
       * - En ese caso NO seteamos Content-Type manualmente.
       * - fetch lo manejará con boundary correcto.
       */
      const isMultipart = isFormData(body);

      /**
       * ✅ Construimos headers finales
       * - Siempre aceptamos JSON
       * - Solo ponemos Content-Type JSON cuando corresponde
       */
      const finalHeaders: Record<string, string> = {
        Accept: 'application/json',
        ...headers,
      };

      if (!isMultipart && body !== undefined && !finalHeaders['Content-Type']) {
        // ✅ Solo si NO es FormData y hay body => Content-Type JSON
        finalHeaders['Content-Type'] = 'application/json';
      }

      /**
       * ✅ Construimos body final:
       * - GET/DELETE normalmente NO envían body
       * - FormData se envía tal cual
       * - string se envía directo
       * - JSON se serializa
       */
      const finalBody = buildRequestBody(method, body, isMultipart);

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

      // ✅ 204 No Content
      if (res.status === 204) {
        return undefined as unknown as TResponse;
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
 * ✅ Construye body final según:
 * - método
 * - tipo de body (FormData / string / JSON)
 */
function buildRequestBody<TBody>(
  method: HttpMethod,
  body?: TBody,
  isMultipart?: boolean
): BodyInit | undefined {
  // ✅ Por seguridad, no mandamos body en GET
  if (method === 'GET') return undefined;

  if (body === undefined) return undefined;

  // ✅ FormData: se envía tal cual
  if (isMultipart) return body as unknown as BodyInit;

  // ✅ Si body ya es string, lo mandamos tal cual
  if (typeof body === 'string') return body;

  // ✅ JSON (objeto)
  return JSON.stringify(body);
}

/**
 * ✅ Detecta FormData de manera segura en RN/Expo
 */
function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData;
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
