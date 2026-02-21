import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { GroupsService } from '@core/services/groups.service';
import { NotificationService } from '@core/services/notification.service';
import { GroupDto } from '@shared/models/common.models';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatCardModule, MatTooltipModule, MatBadgeModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="page-title">
          <mat-icon class="title-icon">groups</mat-icon>
          <h2>Guruhlar</h2>
        </div>
        <button mat-flat-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Qo'shish
        </button>
      </div>

      @if (loading()) {
        <div class="spinner-wrap"><mat-spinner diameter="48"></mat-spinner></div>
      } @else {
        <mat-card appearance="outlined">
          <table mat-table [dataSource]="items()" class="full-width">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>#</th>
              <td mat-cell *matCellDef="let e">{{ e.id }}</td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nomi</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon group-icon">folder_shared</mat-icon>
                  {{ e.name }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="professionName">
              <th mat-header-cell *matHeaderCellDef>Yo'nalish</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon profession-icon">school</mat-icon>
                  {{ e.professionName }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="studentsCount">
              <th mat-header-cell *matHeaderCellDef>O'quvchilar</th>
              <td mat-cell *matCellDef="let e">
                <span class="count-badge">
                  <mat-icon class="row-icon count-icon">people</mat-icon>
                  {{ e.studentsCount }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Amallar</th>
              <td mat-cell *matCellDef="let e">
                <button mat-icon-button matTooltip="Tahrirlash" (click)="openDialog(e)">
                  <mat-icon class="icon-edit">edit</mat-icon>
                </button>
                <button mat-icon-button matTooltip="O'chirish" (click)="deleteItem(e.id)">
                  <mat-icon class="icon-delete">delete</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          @if (items().length === 0) {
            <div class="empty-state">
              <mat-icon>group_off</mat-icon>
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
    .title-icon { color: #7e57c2; font-size: 28px; width: 28px; height: 28px; }
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .full-width { width: 100%; }
    .name-cell { display: flex; align-items: center; gap: 6px; }
    .row-icon { font-size: 18px; width: 18px; height: 18px; }
    .group-icon { color: #7e57c2; }
    .profession-icon { color: #26a69a; }
    .count-icon { color: #42a5f5; }
    .count-badge { display: flex; align-items: center; gap: 4px; font-weight: 500; }
    .icon-edit { color: #ffa726; }
    .icon-delete { color: #ef5350; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: #9e9e9e; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; }
  `]
})
export class GroupsComponent implements OnInit {
  private service = inject(GroupsService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  loading = signal(true);
  items = signal<GroupDto[]>([]);
  columns = ['id', 'name', 'professionName', 'studentsCount', 'actions'];
  ngOnInit() { this.load(); }
  load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: d => { this.items.set(d); this.loading.set(false); }, error: () => this.loading.set(false) });
  }
  openDialog(item?: GroupDto) {
    const ref = this.dialog.open(GroupDialogComponent, { width: '500px', data: item || null });
    ref.afterClosed().subscribe(r => {
      if (r) { const op = item ? this.service.update(item.id, r) : this.service.create(r); op.subscribe({ next: () => { this.notify.showSuccess('Saqlandi'); this.load(); }, error: () => this.notify.showError('Xatolik') }); }
    });
  }
  deleteItem(id: number) {
    this.service.delete(id).subscribe({ next: () => { this.notify.showSuccess("O'chirildi"); this.load(); }, error: () => this.notify.showError('Xatolik') });
  }
}
