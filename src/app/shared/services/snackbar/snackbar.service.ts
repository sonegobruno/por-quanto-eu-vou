import { inject, Injectable } from '@angular/core';
import { SNACKBAR } from './snackbar-port';

@Injectable()
export class SnackbarService {
  private snackBar = inject(SNACKBAR);

  public open(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
