import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import Swal, { SweetAlertIcon } from 'sweetalert2';

export interface ConfirmOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmText?: string;
  cancelText?: string;
  /** When true, applies the destructive (red) confirm button styling. */
  danger?: boolean;
}

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

  // ============ Snackbar (transient toasts) ============

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
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // ============ Modal confirmations (sweetalert) ============

  /**
   * Generic confirmation dialog. Resolves to `true` if the user confirmed,
   * `false` if they dismissed/cancelled.
   */
  async confirm(opts: ConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
      title: opts.title,
      text: opts.text,
      icon: opts.icon ?? 'question',
      showCancelButton: true,
      confirmButtonText: opts.confirmText ?? 'Tasdiqlash',
      cancelButtonText: opts.cancelText ?? 'Bekor qilish',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: 'et-swal',
        title: 'et-swal-title',
        htmlContainer: 'et-swal-text',
        actions: 'et-swal-actions',
        confirmButton: opts.danger ? 'et-swal-btn et-swal-btn-danger' : 'et-swal-btn et-swal-btn-primary',
        cancelButton: 'et-swal-btn et-swal-btn-ghost',
        icon: 'et-swal-icon'
      }
    });
    return result.isConfirmed;
  }

  /**
   * Destructive confirmation tailored for delete actions.
   * Pass the entity name so the user knows what they're removing.
   */
  confirmDelete(name?: string): Promise<boolean> {
    return this.confirm({
      title: "O'chirishni tasdiqlang",
      text: name
        ? `"${name}" yozuvi butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`
        : "Yozuv butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.",
      icon: 'warning',
      confirmText: "Ha, o'chirish",
      cancelText: 'Bekor qilish',
      danger: true
    });
  }

  /** Confirmation for logout. */
  confirmLogout(): Promise<boolean> {
    return this.confirm({
      title: 'Chiqishni tasdiqlang',
      text: "Haqiqatan ham tizimdan chiqmoqchimisiz?",
      icon: 'question',
      confirmText: 'Ha, chiqish',
      cancelText: 'Bekor qilish',
      danger: true
    });
  }
}
