import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Service + HTTP call:
    // provideHttpClient() dang ky HttpClient cho toan bo app.
    // Neu thieu dong nay, service inject HttpClient se bao loi NullInjectorError.
    provideHttpClient()
  ]
};
