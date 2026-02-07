import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GroupsService } from '@core/services/groups.service';
import { NotificationService } from '@core/services/notification.service';
import { GroupDialogComponent, GroupDialogData } from './group-dialog/group-dialog.component';

interface Group {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent implements OnInit {
  private groupsService = inject(GroupsService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  groups = signal<Group[]>([]);
  displayedColumns = ['id', 'name', 'description', 'actions'];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.groupsService.getAll().subscribe({
      next: (groups) => {
        this.groups.set(groups || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load groups:', error);
        this.notificationService.showError('Ma\'lumotlarni yuklashda xatolik');
        this.loading.set(false);
      }
    });
  }

  openDialog(group?: Group): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '500px',
      data: group || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (group) {
          this.updateGroup(group.id, result);
        } else {
          this.createGroup(result);
        }
      }
    });
  }

  private createGroup(data: any): void {
    this.groupsService.create(data).subscribe({
      next: () => {
        this.notificationService.showSuccess('Guruh muvaffaqiyatli qo\'shildi');
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to create group:', error);
        this.notificationService.showError('Qo\'shishda xatolik');
      }
    });
  }

  private updateGroup(id: number, data: any): void {
    this.groupsService.update(id, data).subscribe({
      next: () => {
        this.notificationService.showSuccess('Guruh muvaffaqiyatli yangilandi');
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to update group:', error);
        this.notificationService.showError('Yangilashda xatolik');
      }
    });
  }

  deleteGroup(id: number): void {
    if (confirm('Rostdan ham bu guruhni o\'chirmoqchimisiz?')) {
      this.groupsService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Guruh muvaffaqiyatli o\'chirildi');
          this.loadData();
        },
        error: (error) => {
          console.error('Failed to delete group:', error);
          this.notificationService.showError('O\'chirishda xatolik');
        }
      });
    }
  }
}
