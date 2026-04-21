import { TestBed } from '@angular/core/testing';

import { FormService } from './form.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { LogService } from '@app/core/services/log/log.service';

describe('FormService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormService,
        { provide: SnackbarService, useValue: { warn: vi.fn() } as Pick<SnackbarService, 'warn'> },
        { provide: LogService, useValue: { warn: vi.fn() } as Pick<LogService, 'warn'> },
      ],
    });
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error and call snackBarService and logService', () => {
    const snackBarService = TestBed.inject(SnackbarService);
    const logService = TestBed.inject(LogService);

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
