import { EnvironmentProviders, importProvidersFrom, Provider } from '@angular/core';
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { LogService } from './log.service';
import { LOG } from './log-adapter';

export const logProviders: (Provider | EnvironmentProviders)[] = [
  LogService,
  importProvidersFrom(
    LoggerModule.forRoot({
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      disableConsoleLogging: environment.production,
      timestampFormat: 'short',
    })
  ),
  { provide: LOG, useClass: NGXLogger },
];
