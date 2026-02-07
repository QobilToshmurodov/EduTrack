import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { StudentsService } from '@core/services/students.service';
import { TeachersService } from '@core/services/teachers.service';
import { GroupsService } from '@core/services/groups.service';
import { SubjectsService } from '@core/services/subjects.service';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalGroups: number;
  totalSubjects: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private studentsService = inject(StudentsService);
  private teachersService = inject(TeachersService);
  private groupsService = inject(GroupsService);
  private subjectsService = inject(SubjectsService);

  loading = signal(true);
  stats = signal<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalGroups: 0,
    totalSubjects: 0
  });

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading.set(true);

    Promise.all([
      this.studentsService.getAll().toPromise(),
      this.teachersService.getAll().toPromise(),
      this.groupsService.getAll().toPromise(),
      this.subjectsService.getAll().toPromise()
    ]).then(([students, teachers, groups, subjects]) => {
      this.stats.set({
        totalStudents: students?.length || 0,
        totalTeachers: teachers?.length || 0,
        totalGroups: groups?.length || 0,
        totalSubjects: subjects?.length || 0
      });
      this.loading.set(false);
    }).catch(error => {
      console.error('Failed to load stats:', error);
      this.loading.set(false);
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/cabinet/director/${route}`]);
  }
}
