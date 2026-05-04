import { Routes } from '@angular/router';
import { LandingLayoutComponent } from './landing-layout/landing-layout.component';

export const LANDING_ROUTES: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'news',
        loadComponent: () => import('./news-list/news-list.component').then(m => m.NewsListComponent)
      },
      {
        path: 'news/:id',
        loadComponent: () => import('./news-detail/news-detail.component').then(m => m.NewsDetailComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];
