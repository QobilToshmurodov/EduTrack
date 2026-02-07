import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/cabinet',
    pathMatch: 'full'
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
    redirectTo: '/cabinet'
  }
];
