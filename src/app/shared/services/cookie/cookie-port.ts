import { InjectionToken } from '@angular/core';

export type CookiePort = {
  get: (name: string) => string;
  set(name: string, value: string): void;
};

export const COOKIE = new InjectionToken<CookiePort>('CookiePort');
