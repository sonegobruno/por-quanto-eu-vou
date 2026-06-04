import { EnvironmentProviders, Provider } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const snackbarServiceProvider: (Provider | EnvironmentProviders)[] = [
  SnackbarService,
  MatSnackBar,
];
