import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
  {
    path: 'assignments',
    loadComponent: () => 
      import('./assignments/assignment-list/assignment-list.component').then(m => m.AssignmentListComponent)
  },
  {
    path: 'assignments/create',
    loadComponent: () => 
      import('./assignments/assignment-create/assignment-create.component').then(m => m.AssignmentCreateComponent)
  },
  {
    path: 'assignments/edit/:id',
    loadComponent: () => 
      import('./assignments/assignment-create/assignment-create.component').then(m => m.AssignmentCreateComponent)
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
