// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/api/http-error.interceptor';
import { provideApiConfig } from './core/api/api.config';

export const appConfig: ApplicationConfig = {
  providers: [
    ...provideApiConfig(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([httpErrorInterceptor])
    ),
  ],
};
