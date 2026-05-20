import { EnvironmentProviders, Provider } from '@angular/core';
import { CookieService } from './cookie.service';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

export const cookieServiceProvider: (Provider | EnvironmentProviders)[] = [
  CookieService,
  NgxCookieService,
];
