import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { LogService } from '../log/log.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

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
        {
          provide: SnackbarService,
          useValue: { error: vi.fn() } as Pick<SnackbarService, 'error'>,
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

  it('should show snackbar when handleError is called', () => {
    const snackbarService = TestBed.inject(SnackbarService);
    const testError = new Error('Test error');

    service.handleError(testError);

    expect(snackbarService.error).toHaveBeenCalledWith('Ocorreu um erro inesperado!');
  });
});
