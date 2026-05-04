import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    // Landing: /home  and  /news/:id (all public, no auth guard)
    path: '',
    loadChildren: () => import('./features/landing/landing.routes').then(m => m.LANDING_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'cabinet',
    canActivate: [authGuard],
    loadChildren: () => import('./features/cabinet/cabinet.routes').then(m => m.CABINET_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];