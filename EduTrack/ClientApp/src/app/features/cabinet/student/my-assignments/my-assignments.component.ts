import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../services/student.service';
import { NotificationService } from '@core/services/notification.service';

interface Assignment {
  id: number;
  title: string;
  description: string;
  subjectName: string;
  deadline: Date;
  maxScore: number;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

@Component({
  selector: 'app-my-assignments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './my-assignments.component.html',
  styleUrl: './my-assignments.component.scss'
})
export class MyAssignmentsComponent implements OnInit {
  private router = inject(Router);
  private studentService = inject(StudentService);
  private notificationService = inject(NotificationService);

  loading = signal(true);
  assignments = signal<Assignment[]>([]);

  ngOnInit(): void {
    this.loadAssignments();
  }

  private loadAssignments(): void {
    this.loading.set(true);
    // TODO: Implement getMyAssignments in StudentService
    // Mock data for now
    setTimeout(() => {
      this.assignments.set([]);
      this.loading.set(false);
    }, 500);
  }

  viewAssignment(id: number): void {
    this.router.navigate(['/cabinet/student/assignment', id]);
  }

  submitAssignment(id: number): void {
    this.router.navigate(['/cabinet/student/submit', id]);
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Kutilmoqda';
      case 'submitted': return 'Topshirildi';
      case 'graded': return 'Baholandi';
      default: return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'submitted': return 'accent';
      case 'graded': return 'primary';
      default: return '';
    }
  }

  isExpired(deadline: Date): boolean {
    return new Date(deadline) < new Date();
  }
}
