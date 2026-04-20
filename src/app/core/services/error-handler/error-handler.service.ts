import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LogService } from '../log/log.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  private readonly log = inject(LogService);
  private snackBar = inject(SnackbarService);

  handleError(error: unknown): void {
    this.log.error('Ocorreu um erro inesperado!', error);
    this.snackBar.error('Ocorreu um erro inesperado!');
  }
}
