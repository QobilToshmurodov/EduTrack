import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SubjectsService } from '@core/services/subjects.service';
import { NotificationService } from '@core/services/notification.service';
import { SubjectDto } from '@shared/models/common.models';
import { SubjectDialogComponent } from './subject-dialog/subject-dialog.component';

@Component({
  selector: 'app-subjects',
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
          <div class="crumb">Kabinet <span class="active">Fanlar</span></div>
          <h1>Fanlar <span class="count">{{ items().length }}</span></h1>
          <p>Tizimdagi o'qitiladigan barcha fanlar</p>
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
          <input placeholder="Qidirish: nom, tavsif..." [(ngModel)]="searchQuery">
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
                  <th>Tavsif</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredItems(); track e.id) {
                  <tr>
                    <td class="cell-id">#{{ e.id }}</td>
                    <td>
                      <div class="cell-primary">
                        <mat-icon style="color:var(--et-plum-500)">auto_stories</mat-icon>
                        <div class="name">{{ e.name }}</div>
                      </div>
                    </td>
                    <td style="color:var(--et-ink-3); max-width: 460px;">{{ e.description }}</td>
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
              <mat-icon>library_books</mat-icon>
              <h3>Ma'lumot topilmadi</h3>
              <p>{{ searchQuery() ? 'Qidiruv natijasida hech narsa topilmadi.' : "Qo'shish uchun yuqoridagi tugmadan foydalaning." }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SubjectsComponent implements OnInit {
  private service = inject(SubjectsService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  loading = signal(true);
  items = signal<SubjectDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
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

  openDialog(item?: SubjectDto) {
    const ref = this.dialog.open(SubjectDialogComponent, { width: '500px', data: item || null });
    ref.afterClosed().subscribe(r => {
      if (r) {
        const op = item ? this.service.update(item.id, r) : this.service.create(r);
        op.subscribe({
          next: () => {
            this.notify.showSuccess(item ? 'Fan yangilandi' : "Fan qo'shildi");
            this.load();
          }
        });
      }
    });
  }

  async deleteItem(item: SubjectDto) {
    const ok = await this.notify.confirmDelete(item.name);
    if (!ok) return;
    this.service.delete(item.id).subscribe({
      next: () => { this.notify.showSuccess("Fan o'chirildi"); this.load(); }
    });
  }
}
