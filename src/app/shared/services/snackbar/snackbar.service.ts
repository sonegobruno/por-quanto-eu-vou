import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

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
