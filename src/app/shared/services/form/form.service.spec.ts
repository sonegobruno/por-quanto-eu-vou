import { TestBed } from '@angular/core/testing';

import { FormService } from './form.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { SnackbarMockService } from '../snackbar/snackbar-mock.service';
import { LogService } from '@app/core/services/log/log.service';
import { LogMockService } from '@app/core/services/log/log-mock.service';

describe('FormService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormService,
        LogMockService,
        SnackbarMockService,
        { provide: SnackbarService, useExisting: SnackbarMockService },
        { provide: LogService, useExisting: LogMockService },
      ],
    });
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error and call snackBarService and logService', () => {
    const snackBarService = TestBed.inject(SnackbarMockService);
    const logService = TestBed.inject(LogMockService);

    const errorSummary = [
      {
        message: 'Campo obrigatório',
        fieldTree: () => ({
          focusBoundControl: vi.fn(),
        }),
      },
    ];

    service.handleError(errorSummary as any);

    expect(snackBarService.warn).toHaveBeenCalledWith(errorSummary[0].message);
    expect(logService.warn).toHaveBeenCalledWith('Formulário inválido', errorSummary);
  });
});
