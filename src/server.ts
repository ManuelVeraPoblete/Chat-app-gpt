// src/server.ts
import 'zone.js/node';

import { renderApplication } from '@angular/platform-server';

// ✅ Importa el default export (bootstrap) desde main.server.ts
import bootstrap from './main.server';

/**
 * SSR render entry (Angular 21).
 * renderApplication espera una función bootstrap(context) => Promise<ApplicationRef>
 * NO un componente.
 */
export default function render(url: string, document: string) {
  return renderApplication(bootstrap, {
    document,
    url,
  });
}
