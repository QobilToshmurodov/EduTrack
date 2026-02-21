import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ESGService } from '@core/services/esg.service';
import { NotificationService } from '@core/services/notification.service';
import { ESGDto } from '@shared/models/common.models';
import { ESGDialogComponent } from './esg-dialog/esg-dialog.component';

@Component({
  selector: 'app-esg',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Fan tayinlash</h2>
        <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> Qo'shish</button>
      </div>
      @if (loading()) { <mat-spinner></mat-spinner> }
      @else {
        <table mat-table [dataSource]="items()" class="full-width">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let e">{{e.id}}</td></ng-container>
          <ng-container matColumnDef="employeeName"><th mat-header-cell *matHeaderCellDef>Xodim</th><td mat-cell *matCellDef="let e">{{e.employeeName}}</td></ng-container>
          <ng-container matColumnDef="subjectName"><th mat-header-cell *matHeaderCellDef>Fan</th><td mat-cell *matCellDef="let e">{{e.subjectName}}</td></ng-container>
          <ng-container matColumnDef="groupName"><th mat-header-cell *matHeaderCellDef>Guruh</th><td mat-cell *matCellDef="let e">{{e.groupName}}</td></ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Amallar</th>
            <td mat-cell *matCellDef="let e">
              <button mat-icon-button color="warn" (click)="deleteItem(e.id)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        @if (items().length === 0) { <p class="empty-state">Ma'lumot topilmadi</p> }
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .full-width { width: 100%; }
    .empty-state { text-align: center; padding: 40px; color: #666; }
  `]
})
export class ESGComponent implements OnInit {
  private service = inject(ESGService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  loading = signal(true);
  items = signal<ESGDto[]>([]);
  columns = ['id', 'employeeName', 'subjectName', 'groupName', 'actions'];

  ngOnInit() { this.load(); }
  load() {
    this.loading.set(true);
    this.service.getAll().subscribe({ next: d => { this.items.set(d); this.loading.set(false); }, error: () => this.loading.set(false) });
  }
  openDialog() {
    const ref = this.dialog.open(ESGDialogComponent, { width: '500px' });
    ref.afterClosed().subscribe(r => {
      if (r) this.service.create(r).subscribe({ next: () => { this.notify.showSuccess('Saqlandi'); this.load(); }, error: () => this.notify.showError('Xatolik') });
    });
  }
  deleteItem(id: number) {
    this.service.delete(id).subscribe({ next: () => { this.notify.showSuccess("O'chirildi"); this.load(); }, error: () => this.notify.showError('Xatolik') });
  }
}
