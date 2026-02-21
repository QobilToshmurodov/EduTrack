import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AssignmentsService } from '@core/services/assignments.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { AssignmentDto } from '@shared/models/common.models';
import { AssignmentDialogComponent } from '../assignment-dialog/assignment-dialog.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Topshiriqlar</h2>
        <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> Qo'shish</button>
      </div>
      @if (loading()) { <mat-spinner></mat-spinner> }
      @else {
        <table mat-table [dataSource]="items()" class="full-width">
          <ng-container matColumnDef="title"><th mat-header-cell *matHeaderCellDef>Sarlavha</th><td mat-cell *matCellDef="let e">{{e.title}}</td></ng-container>
          <ng-container matColumnDef="subjectName"><th mat-header-cell *matHeaderCellDef>Fan</th><td mat-cell *matCellDef="let e">{{e.subjectName}}</td></ng-container>
          <ng-container matColumnDef="groupName"><th mat-header-cell *matHeaderCellDef>Guruh</th><td mat-cell *matCellDef="let e">{{e.groupName}}</td></ng-container>
          <ng-container matColumnDef="dueDate"><th mat-header-cell *matHeaderCellDef>Muddat</th><td mat-cell *matCellDef="let e">{{e.dueDate | date:'dd.MM.yyyy'}}</td></ng-container>
          <ng-container matColumnDef="submissionsCount"><th mat-header-cell *matHeaderCellDef>Javoblar</th><td mat-cell *matCellDef="let e">{{e.submissionsCount}}</td></ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Amallar</th>
            <td mat-cell *matCellDef="let e">
              @if (e.filePath) {
                <a mat-icon-button [href]="getFileUrl(e.filePath)" target="_blank"><mat-icon>download</mat-icon></a>
              }
              <button mat-icon-button (click)="uploadFile(e)"><mat-icon>upload_file</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteItem(e.id)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        @if (items().length === 0) { <p class="empty-state">Ma'lumot topilmadi</p> }
      }
      <input type="file" #fileInput style="display:none" (change)="onFileSelected($event)" />
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .full-width { width: 100%; }
    .empty-state { text-align: center; padding: 40px; color: #666; }
  `]
})
export class AssignmentListComponent implements OnInit {
  private service = inject(AssignmentsService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  loading = signal(true);
  items = signal<AssignmentDto[]>([]);
  columns = ['title', 'subjectName', 'groupName', 'dueDate', 'submissionsCount', 'actions'];
  private uploadTargetId: number | null = null;

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const profileId = this.authService.profileId();
    if (profileId) {
      this.service.getByEmployee(profileId).subscribe({
        next: d => { this.items.set(d); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }

  getFileUrl(filePath: string): string {
    return `${environment.apiUrl}/Files/${filePath}`;
  }

  openDialog(item?: AssignmentDto) {
    const ref = this.dialog.open(AssignmentDialogComponent, { width: '600px', data: item || null });
    ref.afterClosed().subscribe(r => {
      if (r) {
        const op = item ? this.service.update(item.id, r) : this.service.create(r);
        op.subscribe({ next: () => { this.notify.showSuccess('Saqlandi'); this.load(); }, error: () => this.notify.showError('Xatolik') });
      }
    });
  }

  uploadFile(item: AssignmentDto) {
    this.uploadTargetId = item.id;
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.uploadTargetId) {
      this.service.uploadFile(this.uploadTargetId, file).subscribe({
        next: () => { this.notify.showSuccess('Fayl yuklandi'); this.load(); },
        error: () => this.notify.showError('Xatolik')
      });
    }
    (event.target as HTMLInputElement).value = '';
  }

  deleteItem(id: number) {
    this.service.delete(id).subscribe({ next: () => { this.notify.showSuccess("O'chirildi"); this.load(); }, error: () => this.notify.showError('Xatolik') });
  }
}
