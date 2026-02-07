import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole();

    if (!userRole) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // Unauthorized - redirect to appropriate page
    router.navigate(['/cabinet/unauthorized']);
    return false;
  };
};
