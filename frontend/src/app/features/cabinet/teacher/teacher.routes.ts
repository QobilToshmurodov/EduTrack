import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
  {
    path: 'assignments',
    loadComponent: () =>
      import('./assignments/assignment-list/assignment-list.component').then(m => m.AssignmentListComponent)
  },
  {
    path: 'submissions',
    loadComponent: () =>
      import('./submissions/submissions.component').then(m => m.SubmissionsComponent)
  },
  {
    path: '',
    redirectTo: 'assignments',
    pathMatch: 'full'
  }
];
