import { InjectionToken } from '@angular/core';

export type SnackbarPort = {
  open: (
    message: string,
    action?: string | undefined,
    config?:
      | {
          duration: number;
          verticalPosition: 'top';
          horizontalPosition: 'right';
        }
      | undefined
  ) => void;
};

export const SNACKBAR = new InjectionToken<SnackbarPort>('SnackbarPort');
