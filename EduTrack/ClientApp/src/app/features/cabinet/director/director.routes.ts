import { Routes } from '@angular/router';

export const DIRECTOR_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'professions',
    loadComponent: () => import('./professions/professions.component').then(m => m.ProfessionsComponent)
  },
  {
    path: 'employees',
    loadComponent: () => import('./employees/employees.component').then(m => m.EmployeesComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./students/students.component').then(m => m.StudentsComponent)
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
    path: 'esg',
    loadComponent: () => import('./esg/esg.component').then(m => m.ESGComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
