import { TestBed } from '@angular/core/testing';

import { LogService } from './log.service';
import { LogConfig, LogConfigToken } from './log-config-token';

describe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogService,
        {
          provide: LogConfigToken,
          useValue: {
            info: vi.fn(),
            error: vi.fn(),
            debug: vi.fn(),
            warn: vi.fn(),
            log: vi.fn(),
          } as LogConfig,
        },
      ],
    });
    service = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all log methods', () => {
    const logConfig = TestBed.inject(LogConfigToken);

    service.info('Info message');
    expect(logConfig.info).toHaveBeenCalledWith('Info message');

    service.error('Error message', new Error('Test error'));
    expect(logConfig.error).toHaveBeenCalledWith('Error message', new Error('Test error'));

    service.debug('Debug message');
    expect(logConfig.debug).toHaveBeenCalledWith('Debug message');

    service.warn('Warn message');
    expect(logConfig.warn).toHaveBeenCalledWith('Warn message');

    service.log('Log message');
    expect(logConfig.log).toHaveBeenCalledWith('Log message');
  });
});
