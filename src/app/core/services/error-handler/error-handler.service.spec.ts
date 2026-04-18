import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { LogService } from '../log/log.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        {
          provide: LogService,
          useValue: { error: vi.fn() } as Pick<LogService, 'error'>,
        },
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log error when handleError is called', () => {
    const logService = TestBed.inject(LogService);
    const testError = new Error('Test error');

    service.handleError(testError);

    expect(logService.error).toHaveBeenCalledWith('Ocorreu um erro inesperado!', testError);
  });
});
