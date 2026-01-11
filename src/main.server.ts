// src/main.server.ts
import { ApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/**
 * Providers SSR: reusa providers del cliente y agrega server rendering.
 */
export const serverConfig: ApplicationConfig = {
  providers: [
    ...(appConfig.providers ?? []),
    provideServerRendering(),
  ],
};

/**
 * ✅ Required by Angular SSR builder:
 * Debe exportar default.
 *
 * Nota: no tipamos `context` porque el tipo BootstrapContext no existe en tu instalación.
 * Angular igual inyecta el contexto SSR correctamente.
 */
export default function bootstrap(context: unknown) {
  // `bootstrapApplication` acepta el contexto SSR como 3er argumento en este builder.
  // Usamos `as any` para compatibilidad sin depender de tipos inexistentes.
  return (bootstrapApplication as any)(AppComponent, serverConfig, context);
}
