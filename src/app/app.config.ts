import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withEnabledBlockingInitialNavigation } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideNativeDateAdapter } from '@angular/material/core';
//import { TokenInterceptor } from './core/interceptors/token.interceptor';

import localeVi from '@angular/common/locales/vi';
import { registerLocaleData } from '@angular/common';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

// 🔥 Đăng ký locale VI
registerLocaleData(localeVi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection(),

    // Locale chuẩn cho Angular
    { provide: LOCALE_ID, useValue: 'vi' },

    provideNativeDateAdapter(),

    provideRouter(
      routes,
      withHashLocation(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),

    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },

    provideAnimations(),
  ],
};
