import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LogService } from '../log/log.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  private readonly log = inject(LogService);
  handleError(error: unknown): void {
    this.log.error('Ocorreu um erro inesperado!', error);
  }
}
