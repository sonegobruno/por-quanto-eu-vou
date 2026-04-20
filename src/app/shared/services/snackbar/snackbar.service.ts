import { inject, Injectable } from '@angular/core';
import { SNACKBAR } from './snackbar-port';

@Injectable()
export class SnackbarService {
  private snackBar = inject(SNACKBAR);

  public warn(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public info(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  public error(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
