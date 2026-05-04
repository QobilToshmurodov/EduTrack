import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SubmissionsService } from '@core/services/submissions.service';
import { StudentsService } from '@core/services/students.service';
import { AuthService } from '@core/services/auth.service';
import { SubmissionDto } from '@shared/models/common.models';

@Component({
  selector: 'app-my-grades',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatProgressSpinnerModule, MatIconModule
  ],
  template: `
    <div class="list-page">
      <div class="list-head">
        <div class="title-block">
          <div class="crumb">Kabinet <span class="active">Baholarim</span></div>
          <h1>Baholarim <span class="count">{{ items().length }}</span></h1>
          <p>Topshirgan ishlaringiz va o'qituvchi tomonidan qo'yilgan baholar</p>
        </div>
      </div>

      <div class="toolbar">
        <div class="search">
          <mat-icon>search</mat-icon>
          <input placeholder="Qidirish: topshiriq nomi..." [(ngModel)]="searchQuery">
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
                  <th>Topshiriq</th>
                  <th>Topshirilgan</th>
                  <th>Baho</th>
                  <th>Izoh</th>
                  <th>Baholangan</th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredItems(); track e.id) {
                  <tr>
                    <td>
                      <div class="cell-primary">
                        <mat-icon style="color:var(--et-primary-600)">task</mat-icon>
                        <div class="name">{{ e.assignmentTitle }}</div>
                      </div>
                    </td>
                    <td style="font-family:var(--et-font-mono); color:var(--et-ink-3);">{{ e.submittedAt | date:'dd.MM.yyyy HH:mm' }}</td>
                    <td>
                      @if (e.grade) {
                        <span class="et-chip" [class]="gradeChipClass(e.grade.value)">
                          <mat-icon style="font-size:14px;width:14px;height:14px;">star</mat-icon>
                          {{ e.grade.value }}
                        </span>
                      } @else {
                        <span class="et-chip et-chip-warning">
                          <mat-icon style="font-size:14px;width:14px;height:14px;">hourglass_empty</mat-icon>
                          Baholanmagan
                        </span>
                      }
                    </td>
                    <td style="color:var(--et-ink-3); max-width: 280px;">{{ e.grade?.comment ?? '—' }}</td>
                    <td>
                      @if (e.grade?.gradedAt) {
                        <span style="font-family:var(--et-font-mono); color:var(--et-ink-3);">{{ e.grade!.gradedAt | date:'dd.MM.yyyy' }}</span>
                      } @else {
                        <span style="color:var(--et-ink-4)">—</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          @if (filteredItems().length === 0) {
            <div class="et-empty">
              <mat-icon>grade</mat-icon>
              <h3>Baholar yo'q</h3>
              <p>{{ searchQuery() ? 'Qidiruv natijasida hech narsa topilmadi.' : "Hali topshirgan ishingiz yo'q yoki baholanmagan." }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class MyGradesComponent implements OnInit {
  private submissionsService = inject(SubmissionsService);
  private studentsService = inject(StudentsService);
  private authService = inject(AuthService);

  loading = signal(true);
  items = signal<SubmissionDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(s => s.assignmentTitle?.toLowerCase().includes(q));
  });

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
    } else {
      this.loading.set(false);
    }
  }

  gradeChipClass(value: number): string {
    if (value >= 86) return 'et-chip-success';
    if (value >= 71) return 'et-chip-info';
    if (value >= 56) return 'et-chip-warning';
    return 'et-chip-danger';
  }
}
