import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-director-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem;">
      <h1>Director Dashboard</h1>
      <p>Dashboard funksiyalari keyinroq qo'shiladi</p>
    </div>
  `
})
export class DirectorDashboardComponent {}

@Component({
  selector: 'app-director-statistics',
  standalone: true,
  template: `
    <div style="padding: 2rem;">
      <h1>Statistika</h1>
      <p>Statistika funksiyalari keyinroq qo'shiladi</p>
    </div>
  `
})
export class DirectorStatisticsComponent {}

export const DIRECTOR_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DirectorDashboardComponent
  },
  {
    path: 'statistics',
    component: DirectorStatisticsComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
