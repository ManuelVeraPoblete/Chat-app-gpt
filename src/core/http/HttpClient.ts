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
  const client: HttpClient = {
    async request<TResponse, TBody = unknown>(
      path: string,
      method: HttpMethod,
      body?: TBody,
      headers: Record<string, string> = {}
    ): Promise<TResponse> {
      const url = `${baseUrl}${path}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

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

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
