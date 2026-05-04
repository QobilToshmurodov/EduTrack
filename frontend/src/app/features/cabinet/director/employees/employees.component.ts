import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeesService } from '@core/services/employees.service';
import { NotificationService } from '@core/services/notification.service';
import { EmployeeDto } from '@shared/models/common.models';
import { avatarColor, initials } from '@shared/utils/avatar.util';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';

@Component({
  selector: 'app-employees',
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
          <div class="crumb">Kabinet <span class="active">Xodimlar</span></div>
          <h1>Xodimlar <span class="count">{{ items().length }}</span></h1>
          <p>O'qituvchi va boshqa xodimlar ro'yxati</p>
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
          <input placeholder="Qidirish: ism, email, telefon..." [(ngModel)]="searchQuery">
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
                  <th>To'liq ism</th>
                  <th>Email</th>
                  <th>Telefon</th>
                  <th>Yo'nalish</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredItems(); track e.id) {
                  <tr>
                    <td class="cell-id">#{{ e.id }}</td>
                    <td>
                      <div class="cell-primary">
                        <div class="et-avatar" [style.background]="getAvatarColor(e.fullName)">{{ getInitials(e.fullName) }}</div>
                        <div class="name">{{ e.fullName }}</div>
                      </div>
                    </td>
                    <td>{{ e.email }}</td>
                    <td>{{ e.phone }}</td>
                    <td>
                      <span class="et-chip et-chip-info">{{ e.professionName }}</span>
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
              <mat-icon>people_outline</mat-icon>
              <h3>Ma'lumot topilmadi</h3>
              <p>{{ searchQuery() ? 'Qidiruv natijasida hech narsa topilmadi.' : "Qo'shish uchun yuqoridagi tugmadan foydalaning." }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class EmployeesComponent implements OnInit {
  private service = inject(EmployeesService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);

  loading = signal(true);
  items = signal<EmployeeDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(e =>
      e.fullName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.phone?.toLowerCase().includes(q) ||
      e.professionName?.toLowerCase().includes(q)
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

  openDialog(item?: EmployeeDto) {
    const ref = this.dialog.open(EmployeeDialogComponent, { width: '500px', data: item || null });
    ref.afterClosed().subscribe(result => {
      if (result) {
        const op = item ? this.service.update(item.id, result) : this.service.create(result);
        op.subscribe({
          next: () => {
            this.notify.showSuccess(item ? 'Xodim yangilandi' : "Xodim qo'shildi");
            this.load();
          }
        });
      }
    });
  }

  async deleteItem(item: EmployeeDto) {
    const ok = await this.notify.confirmDelete(item.fullName);
    if (!ok) return;
    this.service.delete(item.id).subscribe({
      next: () => { this.notify.showSuccess("Xodim o'chirildi"); this.load(); }
    });
  }

  getAvatarColor(name: string): string { return avatarColor(name); }
  getInitials(name: string): string { return initials(name); }
}
