import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <h2>Javoblar</h2>
      @if (loading()) { <mat-spinner></mat-spinner> }
      @else {
        <table mat-table [dataSource]="items()" class="full-width">
          <ng-container matColumnDef="studentName"><th mat-header-cell *matHeaderCellDef>Talaba</th><td mat-cell *matCellDef="let e">{{e.studentName}}</td></ng-container>
          <ng-container matColumnDef="assignmentTitle"><th mat-header-cell *matHeaderCellDef>Topshiriq</th><td mat-cell *matCellDef="let e">{{e.assignmentTitle}}</td></ng-container>
          <ng-container matColumnDef="submittedAt"><th mat-header-cell *matHeaderCellDef>Sana</th><td mat-cell *matCellDef="let e">{{e.submittedAt | date:'dd.MM.yyyy HH:mm'}}</td></ng-container>
          <ng-container matColumnDef="grade"><th mat-header-cell *matHeaderCellDef>Baho</th><td mat-cell *matCellDef="let e">{{e.grade?.value ?? '-'}}</td></ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Amallar</th>
            <td mat-cell *matCellDef="let e">
              @if (e.filePath) {
                <a mat-icon-button [href]="getFileUrl(e.filePath)" target="_blank"><mat-icon>download</mat-icon></a>
              }
              @if (!e.grade) {
                <button mat-icon-button color="primary" (click)="gradeSubmission(e)"><mat-icon>grading</mat-icon></button>
              }
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        @if (items().length === 0) { <p class="empty-state">Ma'lumot topilmadi</p> }
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .full-width { width: 100%; }
    .empty-state { text-align: center; padding: 40px; color: #666; }
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
