import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SubmissionsService } from '@core/services/submissions.service';
import { GradesService } from '@core/services/grades.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { SubmissionDto } from '@shared/models/common.models';
import { avatarColor, initials } from '@shared/utils/avatar.util';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-grade-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
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
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatDialogModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="list-page">
      <div class="list-head">
        <div class="title-block">
          <div class="crumb">Kabinet <span class="active">Javoblar</span></div>
          <h1>Javoblar <span class="count">{{ items().length }}</span></h1>
          <p>O'quvchilardan kelgan topshiriq javoblari va ularni baholash</p>
        </div>
      </div>

      <div class="toolbar">
        <div class="search">
          <mat-icon>search</mat-icon>
          <input placeholder="Qidirish: talaba, topshiriq..." [(ngModel)]="searchQuery">
        </div>
      </div>

      @if (loading()) {
        <div class="et-loading">
          <mat-spinner diameter="36"></mat-spinner>
          <span>Yuklanmoqda...</span>
        </div>
      } @else {
        <div class="table-card">
          <div class="table-scroll">
            <table class="et-table">
              <thead>
                <tr>
                  <th>Talaba</th>
                  <th>Topshiriq</th>
                  <th>Sana</th>
                  <th>Baho</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredItems(); track e.id) {
                  <tr>
                    <td>
                      <div class="cell-primary">
                        <div class="et-avatar" [style.background]="getAvatarColor(e.studentName)">{{ getInitials(e.studentName) }}</div>
                        <div class="name">{{ e.studentName }}</div>
                      </div>
                    </td>
                    <td>{{ e.assignmentTitle }}</td>
                    <td style="font-family:var(--et-font-mono); color:var(--et-ink-3);">{{ e.submittedAt | date:'dd.MM.yyyy HH:mm' }}</td>
                    <td>
                      @if (e.grade) {
                        <span class="et-chip et-chip-success">{{ e.grade.value }}</span>
                      } @else {
                        <span class="et-chip et-chip-warning">Baholanmagan</span>
                      }
                    </td>
                    <td>
                      <div class="row-actions">
                        @if (e.filePath) {
                          <a [href]="getFileUrl(e.filePath)" target="_blank" matTooltip="Faylni yuklab olish"><mat-icon>download</mat-icon></a>
                        }
                        @if (!e.grade) {
                          <button (click)="gradeSubmission(e)" matTooltip="Baholash"><mat-icon>grading</mat-icon></button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          @if (filteredItems().length === 0) {
            <div class="et-empty">
              <mat-icon>inbox</mat-icon>
              <h3>Javoblar yo'q</h3>
              <p>{{ searchQuery() ? 'Qidiruv natijasida hech narsa topilmadi.' : "Hozircha o'quvchilardan javoblar kelmagan." }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SubmissionsComponent implements OnInit {
  private submissionsService = inject(SubmissionsService);
  private gradesService = inject(GradesService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  loading = signal(true);
  items = signal<SubmissionDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(s =>
      s.studentName?.toLowerCase().includes(q) ||
      s.assignmentTitle?.toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const profileId = this.authService.profileId();
    if (!profileId) { this.loading.set(false); return; }
    this.submissionsService.getByEmployee(profileId).subscribe({
      next: items => { this.items.set(items); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getFileUrl(filePath: string): string {
    return `${environment.apiUrl}/Files/${filePath}`;
  }

  gradeSubmission(sub: SubmissionDto) {
    const ref = this.dialog.open(GradeDialogComponent, { width: '400px' });
    ref.afterClosed().subscribe(r => {
      if (r) {
        const profileId = this.authService.profileId()!;
        this.gradesService.create({
          submissionId: sub.id,
          studentId: sub.studentId,
          employeeId: profileId,
          value: r.value,
          comment: r.comment
        }).subscribe({
          next: () => { this.notify.showSuccess('Baholandi'); this.load(); }
        });
      }
    });
  }

  getAvatarColor(name: string): string { return avatarColor(name); }
  getInitials(name: string): string { return initials(name); }
}
