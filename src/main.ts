// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    ...(appConfig.providers ?? []),

    // ✅ No requiere @angular/animations
    provideNoopAnimations(),
  ],
}).catch(console.error);
