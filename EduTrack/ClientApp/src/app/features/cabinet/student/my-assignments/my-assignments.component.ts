import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentsService } from '@core/services/assignments.service';
import { SubmissionsService } from '@core/services/submissions.service';
import { StudentsService } from '@core/services/students.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { AssignmentDto, SubmissionDto } from '@shared/models/common.models';
import { SubmissionDialogComponent } from './submission-dialog/submission-dialog.component';
import { environment } from '@environments/environment';
@Component({
  selector: 'app-my-assignments',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule, MatDialogModule, MatCardModule, MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="page-title">
          <mat-icon class="title-icon">assignment</mat-icon>
          <h2>Mening topshiriqlarim</h2>
        </div>
      </div>

      @if (loading()) {
        <div class="spinner-wrap"><mat-spinner diameter="48"></mat-spinner></div>
      } @else {
        <mat-card appearance="outlined">
          <table mat-table [dataSource]="items()" class="full-width">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Sarlavha</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon task-icon">task</mat-icon>
                  {{ e.title }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="subjectName">
              <th mat-header-cell *matHeaderCellDef>Fan</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon subject-icon">auto_stories</mat-icon>
                  {{ e.subjectName }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="employeeName">
              <th mat-header-cell *matHeaderCellDef>O'qituvchi</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon teacher-icon">badge</mat-icon>
                  {{ e.employeeName }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="dueDate">
              <th mat-header-cell *matHeaderCellDef>Muddat</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon date-icon">event</mat-icon>
                  {{ e.dueDate | date:'dd.MM.yyyy' }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Holat</th>
              <td mat-cell *matCellDef="let e">
                @if (isSubmitted(e.id)) {
                  <span class="status-chip status-chip--done">
                    <mat-icon class="chip-icon">check_circle</mat-icon> Topshirilgan
                  </span>
                } @else {
                  <span class="status-chip status-chip--pending">
                    <mat-icon class="chip-icon">pending</mat-icon> Topshirilmagan
                  </span>
                }
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Amallar</th>
              <td mat-cell *matCellDef="let e">
                @if (e.filePath) {
                  <a mat-icon-button [href]="getFileUrl(e.filePath)" target="_blank" matTooltip="Faylni yuklab olish">
                    <mat-icon class="icon-download">download</mat-icon>
                  </a>
                }
                @if (!isSubmitted(e.id)) {
                  <button mat-flat-button color="primary" (click)="openSubmitDialog(e)">
                    <mat-icon>upload_file</mat-icon> Topshirish
                  </button>
                }
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          @if (items().length === 0) {
            <div class="empty-state">
              <mat-icon>assignment_late</mat-icon>
              <p>Topshiriqlar topilmadi</p>
            </div>
          }
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-title { display: flex; align-items: center; gap: 10px; }
    .page-title h2 { margin: 0; font-size: 1.4rem; font-weight: 600; }
    .title-icon { color: #5c6bc0; font-size: 28px; width: 28px; height: 28px; }
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .full-width { width: 100%; }
    .name-cell { display: flex; align-items: center; gap: 6px; }
    .row-icon { font-size: 18px; width: 18px; height: 18px; }
    .task-icon { color: #5c6bc0; }
    .subject-icon { color: #ef5350; }
    .teacher-icon { color: #26a69a; }
    .date-icon { color: #ffa726; }
    .status-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .chip-icon { font-size: 14px; width: 14px; height: 14px; }
    .status-chip--done { background: #e8f5e9; color: #2e7d32; }
    .status-chip--pending { background: #fff3e0; color: #e65100; }
    .icon-download { color: #42a5f5; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: #9e9e9e; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; }
  `]
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
  columns = ['title', 'subjectName', 'employeeName', 'dueDate', 'status', 'actions'];
  private studentId: number | null = null;
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
  getFileUrl(filePath: string): string {
    return `${environment.apiUrl}/Files/${filePath}`;
  }
  openSubmitDialog(assignment: AssignmentDto) {
    const ref = this.dialog.open(SubmissionDialogComponent, { width: '500px', data: assignment });
    ref.afterClosed().subscribe(result => {
      if (result && this.studentId) {
        this.submissionsService.submit(assignment.id, this.studentId, result.description, result.file).subscribe({
          next: () => { this.notify.showSuccess('Topshirildi'); this.loadSubmissions(); },
          error: () => this.notify.showError('Xatolik')
        });
      }
    });
  }
}
