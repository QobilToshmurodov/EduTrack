import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AssignmentsService } from '@core/services/assignments.service';
import { SubmissionsService } from '@core/services/submissions.service';
import { StudentsService } from '@core/services/students.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { AssignmentDto, SubmissionDto } from '@shared/models/common.models';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-my-assignments',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule],
  template: `
    <div class="page-container">
      <h2>Mening topshiriqlarim</h2>
      @if (loading()) { <mat-spinner></mat-spinner> }
      @else {
        <table mat-table [dataSource]="items()" class="full-width">
          <ng-container matColumnDef="title"><th mat-header-cell *matHeaderCellDef>Sarlavha</th><td mat-cell *matCellDef="let e">{{e.title}}</td></ng-container>
          <ng-container matColumnDef="subjectName"><th mat-header-cell *matHeaderCellDef>Fan</th><td mat-cell *matCellDef="let e">{{e.subjectName}}</td></ng-container>
          <ng-container matColumnDef="employeeName"><th mat-header-cell *matHeaderCellDef>O'qituvchi</th><td mat-cell *matCellDef="let e">{{e.employeeName}}</td></ng-container>
          <ng-container matColumnDef="dueDate"><th mat-header-cell *matHeaderCellDef>Muddat</th><td mat-cell *matCellDef="let e">{{e.dueDate | date:'dd.MM.yyyy'}}</td></ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Holat</th>
            <td mat-cell *matCellDef="let e">
              @if (isSubmitted(e.id)) {
                <mat-chip-set><mat-chip color="primary" highlighted>Topshirilgan</mat-chip></mat-chip-set>
              } @else {
                <mat-chip-set><mat-chip>Topshirilmagan</mat-chip></mat-chip-set>
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Amallar</th>
            <td mat-cell *matCellDef="let e">
              @if (e.filePath) {
                <a mat-icon-button [href]="getFileUrl(e.filePath)" target="_blank"><mat-icon>download</mat-icon></a>
              }
              @if (!isSubmitted(e.id)) {
                <button mat-raised-button color="primary" (click)="submitAssignment(e)">
                  <mat-icon>upload_file</mat-icon> Topshirish
                </button>
              }
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        @if (items().length === 0) { <p class="empty-state">Topshiriqlar topilmadi</p> }
      }
      <input type="file" #fileInput style="display:none" (change)="onFileSelected($event)" />
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .full-width { width: 100%; }
    .empty-state { text-align: center; padding: 40px; color: #666; }
  `]
})
export class MyAssignmentsComponent implements OnInit {
  private assignmentsService = inject(AssignmentsService);
  private submissionsService = inject(SubmissionsService);
  private studentsService = inject(StudentsService);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);

  loading = signal(true);
  items = signal<AssignmentDto[]>([]);
  submissions = signal<SubmissionDto[]>([]);
  columns = ['title', 'subjectName', 'employeeName', 'dueDate', 'status', 'actions'];
  private studentId: number | null = null;
  private submitTargetId: number | null = null;

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

  submitAssignment(assignment: AssignmentDto) {
    this.submitTargetId = assignment.id;
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.submitTargetId && this.studentId) {
      this.submissionsService.submit(this.submitTargetId, this.studentId, file).subscribe({
        next: () => { this.notify.showSuccess('Topshirildi'); this.loadSubmissions(); },
        error: () => this.notify.showError('Xatolik')
      });
    }
    (event.target as HTMLInputElement).value = '';
  }
}
