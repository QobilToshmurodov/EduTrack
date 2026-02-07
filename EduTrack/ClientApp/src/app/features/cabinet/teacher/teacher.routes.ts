import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
  {
    path: 'assignments',
    loadComponent: () => 
      import('./assignments/assignment-list/assignment-list.component').then(m => m.AssignmentListComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => 
      import('./attendance/attendance-mark/attendance-mark.component').then(m => m.AttendanceMarkComponent)
  },
  {
    path: '',
    redirectTo: 'assignments',
    pathMatch: 'full'
  }
];
