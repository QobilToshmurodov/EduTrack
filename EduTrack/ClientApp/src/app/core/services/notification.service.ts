import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
    duration: 3000,
  };

  showSuccess(message: string) {
    this.snackBar.open(message, undefined, {
      ...this.defaultConfig,
      panelClass: ['success-snackbar']
    });
  }

  showWarning(message: string) {
    this.snackBar.open(message, undefined, {
      ...this.defaultConfig,
      panelClass: ['warning-snackbar']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, undefined, {
      ...this.defaultConfig,
      panelClass: ['error-snackbar']
    });
  }
}
