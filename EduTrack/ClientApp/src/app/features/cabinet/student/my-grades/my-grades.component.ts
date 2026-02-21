import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubmissionsService } from '@core/services/submissions.service';
import { StudentsService } from '@core/services/students.service';
import { AuthService } from '@core/services/auth.service';
import { SubmissionDto } from '@shared/models/common.models';

@Component({
  selector: 'app-my-grades',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <h2>Baholarim</h2>
      @if (loading()) { <mat-spinner></mat-spinner> }
      @else {
        <table mat-table [dataSource]="items()" class="full-width">
          <ng-container matColumnDef="assignmentTitle"><th mat-header-cell *matHeaderCellDef>Topshiriq</th><td mat-cell *matCellDef="let e">{{e.assignmentTitle}}</td></ng-container>
          <ng-container matColumnDef="submittedAt"><th mat-header-cell *matHeaderCellDef>Topshirilgan sana</th><td mat-cell *matCellDef="let e">{{e.submittedAt | date:'dd.MM.yyyy HH:mm'}}</td></ng-container>
          <ng-container matColumnDef="grade"><th mat-header-cell *matHeaderCellDef>Baho</th><td mat-cell *matCellDef="let e">{{e.grade?.value ?? 'Baholanmagan'}}</td></ng-container>
          <ng-container matColumnDef="comment"><th mat-header-cell *matHeaderCellDef>Izoh</th><td mat-cell *matCellDef="let e">{{e.grade?.comment ?? '-'}}</td></ng-container>
          <ng-container matColumnDef="gradedAt"><th mat-header-cell *matHeaderCellDef>Baholangan sana</th><td mat-cell *matCellDef="let e">{{e.grade?.gradedAt ? (e.grade.gradedAt | date:'dd.MM.yyyy') : '-'}}</td></ng-container>
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
}
