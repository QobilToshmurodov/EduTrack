import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentsService } from '@core/services/assignments.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { AssignmentDto } from '@shared/models/common.models';
import { AssignmentDialogComponent } from '../assignment-dialog/assignment-dialog.component';
import { environment } from '@environments/environment';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-assignment-list',
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
          <div class="crumb">Kabinet <span class="active">Topshiriqlar</span></div>
          <h1>Topshiriqlar <span class="count">{{ items().length }}</span></h1>
          <p>Yaratgan topshiriqlaringiz va ulardagi javoblar soni</p>
        </div>
        <div class="actions">
          <button class="et-action-btn" (click)="openDialog()">
            <mat-icon>add</mat-icon> Topshiriq qo'shish
          </button>
        </div>
      </div>

      <div class="toolbar">
        <div class="search">
          <mat-icon>search</mat-icon>
          <input placeholder="Qidirish: sarlavha, fan, guruh..." [(ngModel)]="searchQuery">
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
                  <th>Sarlavha</th>
                  <th>Fan</th>
                  <th>Guruh</th>
                  <th>Muddat</th>
                  <th>Javoblar</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredItems(); track e.id) {
                  <tr>
                    <td>
                      <div class="cell-primary">
                        <mat-icon style="color:var(--et-primary-600)">task</mat-icon>
                        <div class="name">{{ e.title }}</div>
                      </div>
                    </td>
                    <td><span class="et-chip et-chip-plum">{{ e.subjectName }}</span></td>
                    <td>{{ e.groupName }}</td>
                    <td style="font-family:var(--et-font-mono); color:var(--et-ink-2);">{{ e.dueDate | date:'dd.MM.yyyy' }}</td>
                    <td>
                      <span class="et-chip et-chip-info">
                        <mat-icon style="font-size:14px;width:14px;height:14px;">rate_review</mat-icon>
                        {{ e.submissionsCount }}
                      </span>
                    </td>
                    <td>
                      <div class="row-actions">
                        @if (e.filePath) {
                          <a [href]="getFileUrl(e.filePath)" target="_blank" matTooltip="Yuklab olish"><mat-icon>download</mat-icon></a>
                        }
                        <button (click)="openDialog(e)" matTooltip="Tahrirlash"><mat-icon>edit</mat-icon></button>
                        <button (click)="deleteItem(e)" class="danger" matTooltip="O'chirish"><mat-icon>delete</mat-icon></button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          @if (filteredItems().length === 0) {
            <div class="et-empty">
              <mat-icon>assignment_late</mat-icon>
              <h3>Ma'lumot topilmadi</h3>
              <p>{{ searchQuery() ? 'Qidiruv natijasida hech narsa topilmadi.' : "Yangi topshiriq yaratish uchun yuqoridagi tugmadan foydalaning." }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AssignmentListComponent implements OnInit {
  private service = inject(AssignmentsService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  loading = signal(true);
  items = signal<AssignmentDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.subjectName?.toLowerCase().includes(q) ||
      a.groupName?.toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const profileId = this.authService.profileId();
    if (profileId) {
      this.service.getByEmployee(profileId).subscribe({
        next: d => { this.items.set(d); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  getFileUrl(filePath: string): string {
    return `${environment.apiUrl}/Files/${filePath}`;
  }

  openDialog(item?: AssignmentDto) {
    const ref = this.dialog.open(AssignmentDialogComponent, { width: '600px', data: item || null });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const { data, file } = result;
        const op = item ? this.service.update(item.id, data) : this.service.create(data);
        op.pipe(
          switchMap(saved => {
            if (file) {
              const id = item ? item.id : (saved as AssignmentDto).id;
              return this.service.uploadFile(id, file);
            }
            return of(null);
          })
        ).subscribe({
          next: () => {
            this.notify.showSuccess(item ? 'Topshiriq yangilandi' : "Topshiriq qo'shildi");
            this.load();
          }
        });
      }
    });
  }

  async deleteItem(item: AssignmentDto) {
    const ok = await this.notify.confirmDelete(item.title);
    if (!ok) return;
    this.service.delete(item.id).subscribe({
      next: () => { this.notify.showSuccess("Topshiriq o'chirildi"); this.load(); }
    });
  }
}
