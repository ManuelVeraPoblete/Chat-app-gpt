/**
 * Error HTTP tipado para manejo consistente de fallos en toda la app.
 */
export class HttpError extends Error {
  public readonly status: number;
  public readonly payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.payload = payload;
  }
}
