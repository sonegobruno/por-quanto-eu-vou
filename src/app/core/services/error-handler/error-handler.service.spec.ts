import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { LogService } from '../log/log.service';
import { LogMockService } from '../log/log-mock.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { SnackbarMockService } from '@app/shared/services/snackbar/snackbar-mock.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        LogMockService,
        SnackbarMockService,
        {
          provide: LogService,
          useExisting: LogMockService,
        },
        {
          provide: SnackbarService,
          useExisting: SnackbarMockService,
        },
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log error when handleError is called', () => {
    const logService = TestBed.inject(LogMockService);
    const testError = new Error('Test error');

    service.handleError(testError);

    expect(logService.error).toHaveBeenCalledWith('Ocorreu um erro inesperado!', testError);
  });

  it('should show snackbar when handleError is called', () => {
    const snackbarService = TestBed.inject(SnackbarMockService);
    const testError = new Error('Test error');

    service.handleError(testError);

    expect(snackbarService.error).toHaveBeenCalledWith('Ocorreu um erro inesperado!');
  });
});
