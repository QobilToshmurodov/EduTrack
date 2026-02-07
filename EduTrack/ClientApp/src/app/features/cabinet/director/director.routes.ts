import { Routes } from '@angular/router';

export const DIRECTOR_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./students/students.component').then(m => m.StudentsComponent)
  },
  {
    path: 'teachers',
    loadComponent: () => import('./teachers/teachers.component').then(m => m.TeachersComponent)
  },
  {
    path: 'groups',
    loadComponent: () => import('./groups/groups.component').then(m => m.GroupsComponent)
  },
  {
    path: 'subjects',
    loadComponent: () => import('./subjects/subjects.component').then(m => m.SubjectsComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
