import { InjectionToken } from '@angular/core';

export type LogConfig = {
  info: (message: string, ...additional: unknown[]) => void;
  error: (message: string, ...additional: unknown[]) => void;
  debug: (message: string, ...additional: unknown[]) => void;
  warn: (message: string, ...additional: unknown[]) => void;
  log: (message: string, ...additional: unknown[]) => void;
};

export const LogConfigToken = new InjectionToken<LogConfig>('LogConfig');
