import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from './tokens';

export const provideApiConfig = (): Provider[] => [
  { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
];
