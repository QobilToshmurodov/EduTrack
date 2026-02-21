import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeesService } from '@core/services/employees.service';
import { NotificationService } from '@core/services/notification.service';
import { EmployeeDto } from '@shared/models/common.models';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Xodimlar</h2>
        <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> Qo'shish</button>
      </div>
      @if (loading()) { <mat-spinner></mat-spinner> }
      @else {
        <table mat-table [dataSource]="items()" class="full-width">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let e">{{e.id}}</td></ng-container>
          <ng-container matColumnDef="fullName"><th mat-header-cell *matHeaderCellDef>To'liq ism</th><td mat-cell *matCellDef="let e">{{e.fullName}}</td></ng-container>
          <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let e">{{e.email}}</td></ng-container>
          <ng-container matColumnDef="phone"><th mat-header-cell *matHeaderCellDef>Telefon</th><td mat-cell *matCellDef="let e">{{e.phone}}</td></ng-container>
          <ng-container matColumnDef="professionName"><th mat-header-cell *matHeaderCellDef>Yo'nalish</th><td mat-cell *matCellDef="let e">{{e.professionName}}</td></ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Amallar</th>
            <td mat-cell *matCellDef="let e">
              <button mat-icon-button (click)="openDialog(e)"><mat-icon>edit</mat-icon></button>
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
export class EmployeesComponent implements OnInit {
  private service = inject(EmployeesService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  loading = signal(true);
  items = signal<EmployeeDto[]>([]);
  columns = ['id', 'fullName', 'email', 'phone', 'professionName', 'actions'];

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
        op.subscribe({ next: () => { this.notify.showSuccess('Saqlandi'); this.load(); }, error: () => this.notify.showError('Xatolik') });
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
