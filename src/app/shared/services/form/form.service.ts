import { inject, Injectable } from '@angular/core';
import { SnackbarService } from '../snackbar/snackbar.service';
import { LogService } from '@app/core/services/log/log.service';
import { ValidationError } from '@angular/forms/signals';

@Injectable()
export class FormService {
  private readonly snackBarService = inject(SnackbarService);

  private readonly logService = inject(LogService);

  public handleError(errorSummary: ValidationError.WithFieldTree[]): void {
    const firstError = errorSummary[0];

    const message = errorSummary.map(error => error.message).join('\n');

    this.snackBarService.warn(message);

    this.logService.warn('Formulário inválido', errorSummary);

    firstError?.fieldTree()?.focusBoundControl();
  }
}
