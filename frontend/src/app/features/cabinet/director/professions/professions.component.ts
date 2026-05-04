import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfessionsService } from '@core/services/professions.service';
import { NotificationService } from '@core/services/notification.service';
import { ProfessionDto } from '@shared/models/common.models';
import { ProfessionDialogComponent } from './profession-dialog/profession-dialog.component';

@Component({
  selector: 'app-professions',
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
          <div class="crumb">Kabinet <span class="active">Yo'nalishlar</span></div>
          <h1>Yo'nalishlar <span class="count">{{ items().length }}</span></h1>
          <p>Texnikum yo'nalishlari va ularga biriktirilgan guruhlar</p>
        </div>
        <div class="actions">
          <button class="et-action-btn" (click)="openDialog()">
            <mat-icon>add</mat-icon> Qo'shish
          </button>
        </div>
      </div>

      <div class="toolbar">
        <div class="search">
          <mat-icon>search</mat-icon>
          <input placeholder="Qidirish: nom, kod, tavsif..." [(ngModel)]="searchQuery">
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
                  <th>Nomi</th>
                  <th>Kod</th>
                  <th>Muddat</th>
                  <th>Tavsif</th>
                  <th>Guruhlar</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredItems(); track e.id) {
                  <tr>
                    <td class="cell-id">#{{ e.id }}</td>
                    <td>
                      <div class="cell-primary">
                        @if (e.iconEmoji) {
                          <span style="font-size: 22px; line-height: 1; width: 28px; text-align: center;">{{ e.iconEmoji }}</span>
                        } @else {
                          <mat-icon style="color:var(--et-warm-500)">work_outline</mat-icon>
                        }
                        <div class="name">{{ e.name }}</div>
                      </div>
                    </td>
                    <td><span class="et-chip et-chip-success">{{ e.code }}</span></td>
                    <td>
                      <span class="et-chip et-chip-info">{{ e.durationYears }} yil</span>
                    </td>
                    <td style="color:var(--et-ink-3); max-width: 320px;">{{ e.description }}</td>
                    <td>
                      <span class="et-chip et-chip-neutral">
                        <mat-icon style="font-size:14px;width:14px;height:14px;">folder_shared</mat-icon>
                        {{ e.groupsCount }}
                      </span>
                    </td>
                    <td>
                      <div class="row-actions">
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
              <mat-icon>work_off</mat-icon>
              <h3>Ma'lumot topilmadi</h3>
              <p>{{ searchQuery() ? 'Qidiruv natijasida hech narsa topilmadi.' : "Qo'shish uchun yuqoridagi tugmadan foydalaning." }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ProfessionsComponent implements OnInit {
  private service = inject(ProfessionsService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  loading = signal(true);
  items = signal<ProfessionDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: data => { this.items.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openDialog(item?: ProfessionDto) {
    const ref = this.dialog.open(ProfessionDialogComponent, { width: '500px', data: item || null });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const op = item ? this.service.update(item.id, result) : this.service.create(result);
        op.subscribe({
          next: () => {
            this.notify.showSuccess(item ? "Yo'nalish yangilandi" : "Yo'nalish qo'shildi");
            this.load();
          }
        });
      }
    });
  }

  async deleteItem(item: ProfessionDto) {
    const ok = await this.notify.confirmDelete(item.name);
    if (!ok) return;
    this.service.delete(item.id).subscribe({
      next: () => { this.notify.showSuccess("Yo'nalish o'chirildi"); this.load(); }
    });
  }
}
