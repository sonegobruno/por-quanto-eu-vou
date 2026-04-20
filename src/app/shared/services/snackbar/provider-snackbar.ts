import { EnvironmentProviders, Provider } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { SNACKBAR } from './snackbar-port';
import { MatSnackBar } from '@angular/material/snack-bar';

export const snackbarServiceProvider: (Provider | EnvironmentProviders)[] = [
  SnackbarService,
  {
    provide: SNACKBAR,
    useClass: MatSnackBar,
  },
];
