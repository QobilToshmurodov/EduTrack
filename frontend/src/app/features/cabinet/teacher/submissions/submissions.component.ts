import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SubmissionsService } from '@core/services/submissions.service';
import { AssignmentsService } from '@core/services/assignments.service';
import { GradesService } from '@core/services/grades.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { SubmissionDto } from '@shared/models/common.models';
import { environment } from '@environments/environment';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-grade-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Baholash</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Baho (0-100)</mat-label>
          <input matInput type="number" formControlName="value" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Izoh</mat-label>
          <textarea matInput formControlName="comment" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Bekor qilish</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Saqlash</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class GradeDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<GradeDialogComponent>);
  form: FormGroup = this.fb.group({
    value: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    comment: ['']
  });
  save() { if (this.form.valid) this.dialogRef.close(this.form.value); }
}
@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatCardModule, MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="page-title">
          <mat-icon class="title-icon">rate_review</mat-icon>
          <h2>Javoblar</h2>
        </div>
      </div>

      @if (loading()) {
        <div class="spinner-wrap"><mat-spinner diameter="48"></mat-spinner></div>
      } @else {
        <mat-card appearance="outlined">
          <table mat-table [dataSource]="items()" class="full-width">
            <ng-container matColumnDef="studentName">
              <th mat-header-cell *matHeaderCellDef>Talaba</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon student-icon">person</mat-icon>
                  {{ e.studentName }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="assignmentTitle">
              <th mat-header-cell *matHeaderCellDef>Topshiriq</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon assignment-icon">task</mat-icon>
                  {{ e.assignmentTitle }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="submittedAt">
              <th mat-header-cell *matHeaderCellDef>Sana</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon date-icon">schedule</mat-icon>
                  {{ e.submittedAt | date:'dd.MM.yyyy HH:mm' }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Baho</th>
              <td mat-cell *matCellDef="let e">
                @if (e.grade) {
                  <span class="grade-chip grade-chip--scored">{{ e.grade.value }}</span>
                } @else {
                  <span class="grade-chip grade-chip--pending">Baholanmagan</span>
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
                @if (!e.grade) {
                  <button mat-icon-button matTooltip="Baholash" (click)="gradeSubmission(e)">
                    <mat-icon class="icon-grade">grading</mat-icon>
                  </button>
                }
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          @if (items().length === 0) {
            <div class="empty-state">
              <mat-icon>inbox</mat-icon>
              <p>Ma'lumot topilmadi</p>
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
    .title-icon { color: #26a69a; font-size: 28px; width: 28px; height: 28px; }
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .full-width { width: 100%; }
    .name-cell { display: flex; align-items: center; gap: 6px; }
    .row-icon { font-size: 18px; width: 18px; height: 18px; }
    .student-icon { color: #26a69a; }
    .assignment-icon { color: #5c6bc0; }
    .date-icon { color: #ffa726; }
    .grade-chip { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .grade-chip--scored { background: #e8f5e9; color: #2e7d32; }
    .grade-chip--pending { background: #fff3e0; color: #e65100; }
    .icon-download { color: #42a5f5; }
    .icon-grade { color: #66bb6a; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: #9e9e9e; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; }
  `]
})
export class SubmissionsComponent implements OnInit {
  private submissionsService = inject(SubmissionsService);
  private assignmentsService = inject(AssignmentsService);
  private gradesService = inject(GradesService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  loading = signal(true);
  items = signal<SubmissionDto[]>([]);
  columns = ['studentName', 'assignmentTitle', 'submittedAt', 'grade', 'actions'];
  ngOnInit() { this.load(); }
  load() {
    this.loading.set(true);
    const profileId = this.authService.profileId();
    if (profileId) {
      this.assignmentsService.getByEmployee(profileId).subscribe(assignments => {
        if (assignments.length === 0) { this.items.set([]); this.loading.set(false); return; }
        const reqs = assignments.map(a => this.submissionsService.getByAssignment(a.id));
        forkJoin(reqs).subscribe({
          next: results => { this.items.set(results.flat()); this.loading.set(false); },
          error: () => this.loading.set(false)
        });
      });
    }
  }
  getFileUrl(filePath: string): string {
    return `${environment.apiUrl}/Files/${filePath}`;
  }
  gradeSubmission(sub: SubmissionDto) {
    const ref = this.dialog.open(GradeDialogComponent, { width: '400px' });
    ref.afterClosed().subscribe(r => {
      if (r) {
        const profileId = this.authService.profileId()!;
        this.gradesService.create({ submissionId: sub.id, studentId: sub.studentId, employeeId: profileId, value: r.value, comment: r.comment }).subscribe({
          next: () => { this.notify.showSuccess('Baholandi'); this.load(); },
          error: () => this.notify.showError('Xatolik')
        });
      }
    });
  }
}
