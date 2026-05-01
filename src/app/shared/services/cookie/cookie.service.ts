import { inject, Injectable } from '@angular/core';
import { CookiePort } from './cookie-port';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

@Injectable()
export class CookieService implements CookiePort {
  private readonly cookie = inject(NgxCookieService);

  get(name: string): string {
    return this.cookie.get(name);
  }

  set(name: string, value: string): void {
    this.cookie.set(name, value);
  }
}
