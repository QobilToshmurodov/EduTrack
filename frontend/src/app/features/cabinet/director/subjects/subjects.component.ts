import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SubjectsService } from '@core/services/subjects.service';
import { NotificationService } from '@core/services/notification.service';
import { SubjectDto } from '@shared/models/common.models';
import { SubjectDialogComponent } from './subject-dialog/subject-dialog.component';
@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatCardModule, MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="page-title">
          <mat-icon class="title-icon">menu_book</mat-icon>
          <h2>Fanlar</h2>
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
                  <mat-icon class="row-icon subject-icon">auto_stories</mat-icon>
                  {{ e.name }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Tavsif</th>
              <td mat-cell *matCellDef="let e">
                <span class="description-text">{{ e.description }}</span>
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
              <mat-icon>library_books</mat-icon>
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
    .title-icon { color: #ef5350; font-size: 28px; width: 28px; height: 28px; }
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .full-width { width: 100%; }
    .name-cell { display: flex; align-items: center; gap: 6px; }
    .row-icon { font-size: 18px; width: 18px; height: 18px; }
    .subject-icon { color: #ef5350; }
    .description-text { color: #757575; font-size: 0.875rem; }
    .icon-edit { color: #ffa726; }
    .icon-delete { color: #ef5350; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: #9e9e9e; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; }
  `]
})
export class SubjectsComponent implements OnInit {
  private service = inject(SubjectsService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  loading = signal(true);
  items = signal<SubjectDto[]>([]);
  columns = ['id', 'name', 'description', 'actions'];
  ngOnInit() { this.load(); }
  load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: d => { this.items.set(d); this.loading.set(false); }, error: () => this.loading.set(false) });
  }
  openDialog(item?: SubjectDto) {
    const ref = this.dialog.open(SubjectDialogComponent, { width: '500px', data: item || null });
    ref.afterClosed().subscribe(r => {
      if (r) { const op = item ? this.service.update(item.id, r) : this.service.create(r); op.subscribe({ next: () => { this.notify.showSuccess('Saqlandi'); this.load(); }, error: () => this.notify.showError('Xatolik') }); }
    });
  }
  deleteItem(id: number) {
    this.service.delete(id).subscribe({ next: () => { this.notify.showSuccess("O'chirildi"); this.load(); }, error: () => this.notify.showError('Xatolik') });
  }
}
