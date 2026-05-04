import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '@environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let apiReq = req.clone({
    url: `${environment.apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
  });

  if (token) {
    apiReq = apiReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(apiReq);
};
