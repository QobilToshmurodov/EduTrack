import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SubmissionsService } from '@core/services/submissions.service';
import { StudentsService } from '@core/services/students.service';
import { AuthService } from '@core/services/auth.service';
import { SubmissionDto } from '@shared/models/common.models';
@Component({
  selector: 'app-my-grades',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="page-title">
          <mat-icon class="title-icon">grade</mat-icon>
          <h2>Baholarim</h2>
        </div>
      </div>

      @if (loading()) {
        <div class="spinner-wrap"><mat-spinner diameter="48"></mat-spinner></div>
      } @else {
        <mat-card appearance="outlined">
          <table mat-table [dataSource]="items()" class="full-width">
            <ng-container matColumnDef="assignmentTitle">
              <th mat-header-cell *matHeaderCellDef>Topshiriq</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon task-icon">task</mat-icon>
                  {{ e.assignmentTitle }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="submittedAt">
              <th mat-header-cell *matHeaderCellDef>Topshirilgan sana</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon date-icon">upload</mat-icon>
                  {{ e.submittedAt | date:'dd.MM.yyyy HH:mm' }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="grade">
              <th mat-header-cell *matHeaderCellDef>Baho</th>
              <td mat-cell *matCellDef="let e">
                @if (e.grade) {
                  <span class="grade-chip" [class]="getGradeClass(e.grade.value)">
                    <mat-icon class="chip-icon">star</mat-icon>
                    {{ e.grade.value }}
                  </span>
                } @else {
                  <span class="grade-chip grade-chip--pending">
                    <mat-icon class="chip-icon">hourglass_empty</mat-icon>
                    Baholanmagan
                  </span>
                }
              </td>
            </ng-container>
            <ng-container matColumnDef="comment">
              <th mat-header-cell *matHeaderCellDef>Izoh</th>
              <td mat-cell *matCellDef="let e">
                <span class="comment-text">{{ e.grade?.comment ?? '—' }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="gradedAt">
              <th mat-header-cell *matHeaderCellDef>Baholangan sana</th>
              <td mat-cell *matCellDef="let e">
                @if (e.grade?.gradedAt) {
                  <div class="name-cell">
                    <mat-icon class="row-icon graded-icon">event_available</mat-icon>
                    {{ e.grade.gradedAt | date:'dd.MM.yyyy' }}
                  </div>
                } @else {
                  <span class="muted">—</span>
                }
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          @if (items().length === 0) {
            <div class="empty-state">
              <mat-icon>grade</mat-icon>
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
    .title-icon { color: #ffa726; font-size: 28px; width: 28px; height: 28px; }
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .full-width { width: 100%; }
    .name-cell { display: flex; align-items: center; gap: 6px; }
    .row-icon { font-size: 18px; width: 18px; height: 18px; }
    .task-icon { color: #5c6bc0; }
    .date-icon { color: #42a5f5; }
    .graded-icon { color: #66bb6a; }
    .grade-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .chip-icon { font-size: 14px; width: 14px; height: 14px; }
    .grade-chip--excellent { background: #e8f5e9; color: #2e7d32; }
    .grade-chip--good { background: #e3f2fd; color: #1565c0; }
    .grade-chip--average { background: #fff3e0; color: #e65100; }
    .grade-chip--poor { background: #ffebee; color: #c62828; }
    .grade-chip--pending { background: #f5f5f5; color: #757575; }
    .comment-text { color: #757575; font-size: 0.875rem; }
    .muted { color: #bdbdbd; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: #9e9e9e; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; }
  `]
})
export class MyGradesComponent implements OnInit {
  private submissionsService = inject(SubmissionsService);
  private studentsService = inject(StudentsService);
  private authService = inject(AuthService);
  loading = signal(true);
  items = signal<SubmissionDto[]>([]);
  columns = ['assignmentTitle', 'submittedAt', 'grade', 'comment', 'gradedAt'];
  ngOnInit() {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.studentsService.getByUserId(userId).subscribe({
        next: student => {
          this.submissionsService.getByStudent(student.id).subscribe({
            next: subs => { this.items.set(subs); this.loading.set(false); },
            error: () => this.loading.set(false)
          });
        },
        error: () => this.loading.set(false)
      });
    }
  }
  getGradeClass(value: number): string {
    if (value >= 86) return 'grade-chip grade-chip--excellent';
    if (value >= 71) return 'grade-chip grade-chip--good';
    if (value >= 56) return 'grade-chip grade-chip--average';
    return 'grade-chip grade-chip--poor';
  }
}
