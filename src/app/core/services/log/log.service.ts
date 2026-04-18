import { inject, Injectable } from '@angular/core';
import { LogAdapter, LOG } from './log-adapter';

@Injectable()
export class LogService implements LogAdapter {
  private logConfig = inject(LOG);

  public info(message: string, ...additional: unknown[]): void {
    this.logConfig.info(message, ...additional);
  }

  public error(message: string, error: unknown): void {
    this.logConfig.error(message, error);
  }

  public debug(message: string, ...additional: unknown[]): void {
    this.logConfig.debug(message, ...additional);
  }

  public warn(message: string, ...additional: unknown[]): void {
    this.logConfig.warn(message, ...additional);
  }

  public log(message: string, ...additional: unknown[]): void {
    this.logConfig.log(message, ...additional);
  }
}
