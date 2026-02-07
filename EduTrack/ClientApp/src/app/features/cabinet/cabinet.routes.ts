import { Routes } from '@angular/router';
import { CabinetLayoutComponent } from './layout/cabinet-layout.component';
import { roleGuard } from '@core/guards/role.guard';
import { UserRole } from '@core/models/user.model';

export const CABINET_ROUTES: Routes = [
  {
    path: '',
    component: CabinetLayoutComponent,
    children: [
      {
        path: 'director',
        canActivate: [roleGuard([UserRole.Admin, UserRole.Director])],
        loadChildren: () => import('./director/director.routes').then(m => m.DIRECTOR_ROUTES)
      },
      {
        path: 'teacher',
        canActivate: [roleGuard([UserRole.Teacher])],
        loadChildren: () => import('./teacher/teacher.routes').then(m => m.TEACHER_ROUTES)
      },
      {
        path: 'student',
        canActivate: [roleGuard([UserRole.Student])],
        loadChildren: () => import('./student/student.routes').then(m => m.STUDENT_ROUTES)
      },
      {
        path: '',
        redirectTo: 'teacher',
        pathMatch: 'full'
      }
    ]
  }
];
