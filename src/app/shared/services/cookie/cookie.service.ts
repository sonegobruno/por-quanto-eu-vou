import { inject, Injectable } from '@angular/core';
import { CookiePort } from './cookie-port';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';
import { addMonths } from 'date-fns';
import { now } from '@app/shared/utils/date/date-utils';

@Injectable()
export class CookieService implements CookiePort {
  private readonly cookie = inject(NgxCookieService);

  get(name: string): string {
    return this.cookie.get(name);
  }

  set(name: string, value: string, expires?: Date): void {
    const sixMonths = 6;
    const expireDate = expires ? expires : addMonths(now(), sixMonths);
    this.cookie.set(name, value, expireDate);
  }
}
