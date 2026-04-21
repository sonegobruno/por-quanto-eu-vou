import {
  ApplicationConfig,
  ErrorHandler,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { logProviders } from './core/services/log/log-providers';
import { ErrorHandlerService } from './core/services/error-handler/error-handler.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { snackbarServiceProvider } from './shared/services/snackbar/provider-snackbar';
import { FormService } from './shared/services/form/form.service';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    ...logProviders,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    DatePipe,
    { provide: LOCALE_ID, useValue: 'pt' },
    ...snackbarServiceProvider,
    FormService,
  ],
};
