import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentsService } from '@core/services/assignments.service';
import { SubmissionsService } from '@core/services/submissions.service';
import { StudentsService } from '@core/services/students.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { AssignmentDto, SubmissionDto } from '@shared/models/common.models';
import { SubmissionDialogComponent } from './submission-dialog/submission-dialog.component';
import { environment } from '@environments/environment';

const SUBJECT_TONE: Record<string, string> = {
  'Matematika': 'math',
  "O'zbek tili": 'lang',
  "O`zbek tili": 'lang',
  'Fizika': 'science',
  'Tarix': 'history',
  'Kimyo': 'science',
  'Biologiya': 'science',
  'Geografiya': 'history',
  'Ingliz tili': 'lang',
  'Rus tili': 'lang',
  'Adabiyot': 'lang',
  'Informatika': 'math',
};

@Component({
  selector: 'app-my-assignments',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDialogModule, MatTooltipModule
  ],
  templateUrl: './my-assignments.component.html',
  styleUrl: './my-assignments.component.scss'
})
export class MyAssignmentsComponent implements OnInit {
  private assignmentsService = inject(AssignmentsService);
  private submissionsService = inject(SubmissionsService);
  private studentsService = inject(StudentsService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  items = signal<AssignmentDto[]>([]);
  submissions = signal<SubmissionDto[]>([]);
  private studentId: number | null = null;

  dueSoonCount = computed(() => this.items().filter(a =>
    !this.isSubmitted(a.id) && !this.isOverdue(a.dueDate)
  ).length);

  inProgressCount = computed(() => this.items().filter(a =>
    !this.isSubmitted(a.id) && this.isOverdue(a.dueDate)
  ).length);

  doneCount = computed(() => this.items().filter(a => this.isSubmitted(a.id)).length);

  ngOnInit() {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.studentsService.getByUserId(userId).subscribe({
        next: student => {
          this.studentId = student.id;
          if (student.groupId) {
            this.assignmentsService.getByGroup(student.groupId).subscribe({
              next: assignments => { this.items.set(assignments); this.loadSubmissions(); },
              error: () => this.loading.set(false)
            });
          } else {
            this.loading.set(false);
          }
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  loadSubmissions() {
    if (this.studentId) {
      this.submissionsService.getByStudent(this.studentId).subscribe({
        next: subs => { this.submissions.set(subs); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }

  isSubmitted(assignmentId: number): boolean {
    return this.submissions().some(s => s.assignmentId === assignmentId);
  }

  isOverdue(dueDate: string | Date): boolean {
    return new Date(dueDate).getTime() < Date.now();
  }

  timeLeft(dueDate: string | Date): string {
    const ms = new Date(dueDate).getTime() - Date.now();
    if (ms < 0) return "Muddat o'tdi";
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    if (days > 0) return `${days} kun ${hours} soat`;
    if (hours > 0) return `${hours} soat`;
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${minutes} daqiqa`;
  }

  subjectTone(name: string | undefined): string {
    if (!name) return 'neutral';
    return SUBJECT_TONE[name] ?? 'neutral';
  }

  getFileUrl(filePath: string): string {
    return `${environment.apiUrl}/Files/${filePath}`;
  }

  openSubmitDialog(assignment: AssignmentDto) {
    const ref = this.dialog.open(SubmissionDialogComponent, { width: '500px', data: assignment });
    ref.afterClosed().subscribe(result => {
      if (result && this.studentId) {
        this.submissionsService.submit(assignment.id, result.description, result.file).subscribe({
          next: () => { this.notify.showSuccess('Topshirildi'); this.loadSubmissions(); },
          error: () => this.notify.showError('Xatolik')
        });
      }
    });
  }
}
