import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

const isAuthEndpoint = (url: string) => url.includes('/Auth/login');

const messageFromError = (error: HttpErrorResponse): string => {
  // Backend sends `{ message: string }`; fall back gracefully.
  const body = error.error;
  if (body && typeof body === 'object') {
    if (typeof body.message === 'string' && body.message) return body.message;
    if (typeof body.title === 'string' && body.title) return body.title;
  }
  if (typeof body === 'string' && body) return body;
  return '';
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Kutilmagan xatolik yuz berdi';
      let showToast = true;

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Tarmoq xatosi: ${error.error.message}`;
      } else {
        const serverMessage = messageFromError(error);

        switch (error.status) {
          case 0:
            errorMessage = "Serverga ulanib bo'lmadi. Internet aloqangizni tekshiring.";
            break;
          case 400:
            errorMessage = serverMessage || "So'rov noto'g'ri tuzilgan.";
            break;
          case 401:
            errorMessage = serverMessage || (isAuthEndpoint(req.url)
              ? "Foydalanuvchi nomi yoki parol noto'g'ri."
              : "Sessiya muddati tugadi. Iltimos, qaytadan kiring.");
            if (!isAuthEndpoint(req.url)) {
              authService.logout();
            }
            break;
          case 403:
            errorMessage = serverMessage || "Sizda ushbu amal uchun ruxsat yo'q.";
            router.navigate(['/cabinet/unauthorized']);
            break;
          case 404:
            errorMessage = serverMessage || "Ma'lumot topilmadi.";
            break;
          case 409:
            errorMessage = serverMessage || "Konflikt: ushbu yozuv allaqachon mavjud yoki bog'liq ma'lumotlar bor.";
            break;
          case 413:
            errorMessage = serverMessage || "Yuklangan fayl hajmi juda katta.";
            break;
          case 422:
            errorMessage = serverMessage || "Kiritilgan ma'lumotlar noto'g'ri.";
            break;
          case 500:
            errorMessage = serverMessage || "Serverda ichki xatolik yuz berdi.";
            break;
          case 502:
          case 503:
          case 504:
            errorMessage = "Server vaqtincha ishlamayapti. Bir oz vaqtdan keyin urinib ko'ring.";
            break;
          default:
            errorMessage = serverMessage || `Xatolik kodi: ${error.status}`;
        }
      }

      console.error('HTTP Error:', error.status, errorMessage, error);

      if (showToast) {
        notify.showError(errorMessage);
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
