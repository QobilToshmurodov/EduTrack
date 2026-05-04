import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ESGService } from '@core/services/esg.service';
import { NotificationService } from '@core/services/notification.service';
import { ESGDto } from '@shared/models/common.models';
import { avatarColor, initials } from '@shared/utils/avatar.util';
import { ESGDialogComponent } from './esg-dialog/esg-dialog.component';

@Component({
  selector: 'app-esg',
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
          <div class="crumb">Kabinet <span class="active">Fan tayinlash</span></div>
          <h1>Fan tayinlash <span class="count">{{ items().length }}</span></h1>
          <p>Xodimlarni fan va guruhlarga biriktirish</p>
        </div>
        <div class="actions">
          <button class="et-action-btn" (click)="openDialog()">
            <mat-icon>add</mat-icon> Tayinlash
          </button>
        </div>
      </div>

      <div class="toolbar">
        <div class="search">
          <mat-icon>search</mat-icon>
          <input placeholder="Qidirish: xodim, fan, guruh..." [(ngModel)]="searchQuery">
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
                  <th>#</th>
                  <th>Xodim</th>
                  <th>Fan</th>
                  <th>Guruh</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredItems(); track e.id) {
                  <tr>
                    <td class="cell-id">#{{ e.id }}</td>
                    <td>
                      <div class="cell-primary">
                        <div class="et-avatar" [style.background]="getAvatarColor(e.employeeName)">{{ getInitials(e.employeeName) }}</div>
                        <div class="name">{{ e.employeeName }}</div>
                      </div>
                    </td>
                    <td><span class="et-chip et-chip-plum">{{ e.subjectName }}</span></td>
                    <td><span class="et-chip et-chip-info">{{ e.groupName }}</span></td>
                    <td>
                      <div class="row-actions">
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
              <p>{{ searchQuery() ? 'Qidiruv natijasida hech narsa topilmadi.' : 'Yangi tayinlash uchun yuqoridagi tugmadan foydalaning.' }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ESGComponent implements OnInit {
  private service = inject(ESGService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  loading = signal(true);
  items = signal<ESGDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(e =>
      e.employeeName?.toLowerCase().includes(q) ||
      e.subjectName?.toLowerCase().includes(q) ||
      e.groupName?.toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: d => { this.items.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openDialog() {
    const ref = this.dialog.open(ESGDialogComponent, { width: '500px' });
    ref.afterClosed().subscribe(r => {
      if (r) this.service.create(r).subscribe({
        next: () => { this.notify.showSuccess('Tayinlash saqlandi'); this.load(); }
      });
    });
  }

  async deleteItem(item: ESGDto) {
    const ok = await this.notify.confirmDelete(`${item.employeeName} — ${item.subjectName} (${item.groupName})`);
    if (!ok) return;
    this.service.delete(item.id).subscribe({
      next: () => { this.notify.showSuccess("Tayinlash o'chirildi"); this.load(); }
    });
  }

  getAvatarColor(name: string): string { return avatarColor(name); }
  getInitials(name: string): string { return initials(name); }
}
