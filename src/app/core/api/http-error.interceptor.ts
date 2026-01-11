import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      // Centraliza errores HTTP (SRP)
      if (err instanceof HttpErrorResponse) {
        console.error('[HTTP ERROR]', {
          url: req.url,
          status: err.status,
          message: err.message,
          error: err.error,
        });
      } else {
        console.error('[UNKNOWN ERROR]', err);
      }
      return throwError(() => err);
    })
  );
};
