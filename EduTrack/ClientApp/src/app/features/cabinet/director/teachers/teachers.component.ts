import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeachersService } from '@core/services/teachers.service';
import { NotificationService } from '@core/services/notification.service';
import { TeacherDialogComponent, TeacherDialogData } from './teacher-dialog/teacher-dialog.component';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent implements OnInit {
  private teachersService = inject(TeachersService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  teachers = signal<Teacher[]>([]);
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.teachersService.getAll().subscribe({
      next: (teachers) => {
        this.teachers.set((teachers || []) as unknown as Teacher[]);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load teachers:', error);
        this.notificationService.showError('Ma\'lumotlarni yuklashda xatolik');
        this.loading.set(false);
      }
    });
  }

  openDialog(teacher?: Teacher): void {
    const dialogRef = this.dialog.open(TeacherDialogComponent, {
      width: '600px',
      data: teacher || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (teacher) {
          this.updateTeacher(teacher.id, result);
        } else {
          this.createTeacher(result);
        }
      }
    });
  }

  private createTeacher(data: any): void {
    this.teachersService.create(data).subscribe({
      next: () => {
        this.notificationService.showSuccess('O\'qituvchi muvaffaqiyatli qo\'shildi');
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to create teacher:', error);
        this.notificationService.showError('Qo\'shishda xatolik');
      }
    });
  }

  private updateTeacher(id: number, data: any): void {
    this.teachersService.update(id, data).subscribe({
      next: () => {
        this.notificationService.showSuccess('O\'qituvchi muvaffaqiyatli yangilandi');
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to update teacher:', error);
        this.notificationService.showError('Yangilashda xatolik');
      }
    });
  }

  deleteTeacher(id: number): void {
    if (confirm('Rostdan ham bu o\'qituvchini o\'chirmoqchimisiz?')) {
      this.teachersService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('O\'qituvchi muvaffaqiyatli o\'chirildi');
          this.loadData();
        },
        error: (error) => {
          console.error('Failed to delete teacher:', error);
          this.notificationService.showError('O\'chirishda xatolik');
        }
      });
    }
  }
}
