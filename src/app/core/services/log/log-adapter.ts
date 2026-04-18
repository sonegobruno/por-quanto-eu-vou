import { InjectionToken } from '@angular/core';

export type LogAdapter = {
  info: (message: string, ...additional: unknown[]) => void;
  error: (message: string, ...additional: unknown[]) => void;
  debug: (message: string, ...additional: unknown[]) => void;
  warn: (message: string, ...additional: unknown[]) => void;
  log: (message: string, ...additional: unknown[]) => void;
};

export const LOG = new InjectionToken<LogAdapter>('LogAdapter');
