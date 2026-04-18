import { InjectionToken } from '@angular/core';

export type SnackbarAdapter = {
  open: (
    message: string,
    action?: string | undefined,
    config?:
      | {
          duration: number;
          direction: 'rtl';
          verticalPosition: 'top';
          horizontalPosition: 'right';
        }
      | undefined
  ) => void;
};

export const SNACKBAR = new InjectionToken<SnackbarAdapter>('SnackbarAdapter');
