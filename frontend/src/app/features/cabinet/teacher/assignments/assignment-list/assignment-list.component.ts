import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentsService } from '@core/services/assignments.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { AssignmentDto } from '@shared/models/common.models';
import { AssignmentDialogComponent } from '../assignment-dialog/assignment-dialog.component';
import { environment } from '@environments/environment';
import { switchMap, of } from 'rxjs';
@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatCardModule, MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="page-title">
          <mat-icon class="title-icon">assignment</mat-icon>
          <h2>Topshiriqlar</h2>
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
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Sarlavha</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon title-icon-row">task</mat-icon>
                  {{ e.title }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="subjectName">
              <th mat-header-cell *matHeaderCellDef>Fan</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon subject-icon">auto_stories</mat-icon>
                  {{ e.subjectName }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="groupName">
              <th mat-header-cell *matHeaderCellDef>Guruh</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon group-icon">folder_shared</mat-icon>
                  {{ e.groupName }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="dueDate">
              <th mat-header-cell *matHeaderCellDef>Muddat</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon date-icon">event</mat-icon>
                  {{ e.dueDate | date:'dd.MM.yyyy' }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="submissionsCount">
              <th mat-header-cell *matHeaderCellDef>Javoblar</th>
              <td mat-cell *matCellDef="let e">
                <div class="name-cell">
                  <mat-icon class="row-icon submissions-icon">rate_review</mat-icon>
                  {{ e.submissionsCount }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Amallar</th>
              <td mat-cell *matCellDef="let e">
                @if (e.filePath) {
                  <a mat-icon-button [href]="getFileUrl(e.filePath)" target="_blank" matTooltip="Yuklab olish">
                    <mat-icon class="icon-download">download</mat-icon>
                  </a>
                }
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
              <mat-icon>assignment_late</mat-icon>
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
    .title-icon { color: #5c6bc0; font-size: 28px; width: 28px; height: 28px; }
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .full-width { width: 100%; }
    .name-cell { display: flex; align-items: center; gap: 6px; }
    .row-icon { font-size: 18px; width: 18px; height: 18px; }
    .title-icon-row { color: #5c6bc0; }
    .subject-icon { color: #ef5350; }
    .group-icon { color: #7e57c2; }
    .date-icon { color: #ffa726; }
    .submissions-icon { color: #26a69a; }
    .icon-download { color: #42a5f5; }
    .icon-edit { color: #ffa726; }
    .icon-delete { color: #ef5350; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: #9e9e9e; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; }
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
    ref.afterClosed().subscribe(result => {
      if (result) {
        const { data, file } = result;
        const op = item ? this.service.update(item.id, data) : this.service.create(data);
        op.pipe(
          switchMap(saved => {
            if (file) {
              const id = item ? item.id : (saved as AssignmentDto).id;
              return this.service.uploadFile(id, file);
            }
            return of(null);
          })
        ).subscribe({
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
