import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { SNACKBAR } from './snackbar-adapter';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        {
          provide: SNACKBAR,
          useValue: { open: vi.fn() },
        },
      ],
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call open method of snackBar with correct parameters', () => {
    const snackBar = TestBed.inject(SNACKBAR);
    const message = 'Test message';

    service.open(message);

    expect(snackBar.open).toHaveBeenCalledWith(message, undefined, {
      duration: 5000,
      direction: 'rtl',
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  });
});
