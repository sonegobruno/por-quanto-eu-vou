import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

class MockMatSnackBarMock {
  open = vi.fn();
}

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        MockMatSnackBarMock,
        {
          provide: MatSnackBar,
          useExisting: MockMatSnackBarMock,
        },
      ],
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call open method of snackBar with correct parameters', () => {
    const snackBar = TestBed.inject(MockMatSnackBarMock);
    const message = 'Test message';

    service.warn(message);

    expect(snackBar.open).toHaveBeenCalledWith(message, undefined, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  });
});
