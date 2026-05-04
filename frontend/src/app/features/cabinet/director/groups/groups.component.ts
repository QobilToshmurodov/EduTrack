import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GroupsService } from '@core/services/groups.service';
import { NotificationService } from '@core/services/notification.service';
import { GroupDto } from '@shared/models/common.models';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';

@Component({
  selector: 'app-groups',
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
          <div class="crumb">Kabinet <span class="active">Guruhlar</span></div>
          <h1>Guruhlar <span class="count">{{ items().length }}</span></h1>
          <p>Akademik guruhlar va ulardagi o'quvchilar soni</p>
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
          <input placeholder="Qidirish: nom, yo'nalish..." [(ngModel)]="searchQuery">
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
                  <th>Yo'nalish</th>
                  <th>O'quvchilar</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredItems(); track e.id) {
                  <tr>
                    <td class="cell-id">#{{ e.id }}</td>
                    <td>
                      <div class="cell-primary">
                        <mat-icon style="color:var(--et-primary-600)">folder_shared</mat-icon>
                        <div class="name">{{ e.name }}</div>
                      </div>
                    </td>
                    <td>{{ e.professionName }}</td>
                    <td>
                      <span class="et-chip et-chip-neutral">
                        <mat-icon style="font-size:14px;width:14px;height:14px;">people</mat-icon>
                        {{ e.studentsCount }}
                      </span>
                    </td>
                    <td>
                      <div class="row-actions">
                        <button (click)="openDialog(e)" matTooltip="Tahrirlash"><mat-icon>edit</mat-icon></button>
                        <button (click)="deleteItem(e.id)" class="danger" matTooltip="O'chirish"><mat-icon>delete</mat-icon></button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          @if (filteredItems().length === 0) {
            <div class="et-empty">
              <mat-icon>group_off</mat-icon>
              <h3>Ma'lumot topilmadi</h3>
              <p>{{ searchQuery() ? 'Qidiruv natijasida hech narsa topilmadi.' : "Qo'shish uchun yuqoridagi tugmadan foydalaning." }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class GroupsComponent implements OnInit {
  private service = inject(GroupsService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  loading = signal(true);
  items = signal<GroupDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(g =>
      g.name?.toLowerCase().includes(q) ||
      g.professionName?.toLowerCase().includes(q)
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

  openDialog(item?: GroupDto) {
    const ref = this.dialog.open(GroupDialogComponent, { width: '500px', data: item || null });
    ref.afterClosed().subscribe(r => {
      if (r) {
        const op = item ? this.service.update(item.id, r) : this.service.create(r);
        op.subscribe({
          next: () => { this.notify.showSuccess('Saqlandi'); this.load(); },
          error: () => this.notify.showError('Xatolik')
        });
      }
    });
  }

  deleteItem(id: number) {
    this.service.delete(id).subscribe({
      next: () => { this.notify.showSuccess("O'chirildi"); this.load(); },
      error: () => this.notify.showError('Xatolik')
    });
  }
}
