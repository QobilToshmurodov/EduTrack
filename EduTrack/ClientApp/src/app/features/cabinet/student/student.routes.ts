import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-assignments',
  standalone: true,
  template: `
    <div style="padding: 2rem;">
      <h1>Mening Topshiriqlarim</h1>
      <p>Topshiriqlar ro'yxati keyinroq qo'shiladi</p>
    </div>
  `
})
export class MyAssignmentsComponent {}

@Component({
  selector: 'app-my-grades',
  standalone: true,
  template: `
    <div style="padding: 2rem;">
      <h1>Baholarim</h1>
      <p>Baholar ro'yxati keyinroq qo'shiladi</p>
    </div>
  `
})
export class MyGradesComponent {}

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  template: `
    <div style="padding: 2rem;">
      <h1>Davomatim</h1>
      <p>Davomat tarixi keyinroq qo'shiladi</p>
    </div>
  `
})
export class MyAttendanceComponent {}

export const STUDENT_ROUTES: Routes = [
  {
    path: 'my-assignments',
    component: MyAssignmentsComponent
  },
  {
    path: 'my-grades',
    component: MyGradesComponent
  },
  {
    path: 'my-attendance',
    component: MyAttendanceComponent
  },
  {
    path: '',
    redirectTo: 'my-assignments',
    pathMatch: 'full'
  }
];
