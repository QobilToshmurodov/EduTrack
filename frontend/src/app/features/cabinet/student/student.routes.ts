import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: 'my-assignments',
    loadComponent: () => 
      import('./my-assignments/my-assignments.component').then(m => m.MyAssignmentsComponent)
  },
  {
    path: 'my-grades',
    loadComponent: () => 
      import('./my-grades/my-grades.component').then(m => m.MyGradesComponent)
  },
  {
    path: '',
    redirectTo: 'my-assignments',
    pathMatch: 'full'
  }
];
