import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeachersService } from '@core/services/teachers.service';
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
  private snackBar = inject(MatSnackBar);
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
        this.snackBar.open('Ma\'lumotlarni yuklashda xatolik', 'Yopish', { duration: 3000 });
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
        this.snackBar.open('O\'qituvchi muvaffaqiyatli qo\'shildi', 'Yopish', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to create teacher:', error);
        this.snackBar.open('Qo\'shishda xatolik', 'Yopish', { duration: 3000 });
      }
    });
  }

  private updateTeacher(id: number, data: any): void {
    this.teachersService.update(id, data).subscribe({
      next: () => {
        this.snackBar.open('O\'qituvchi muvaffaqiyatli yangilandi', 'Yopish', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to update teacher:', error);
        this.snackBar.open('Yangilashda xatolik', 'Yopish', { duration: 3000 });
      }
    });
  }

  deleteTeacher(id: number): void {
    if (confirm('Rostdan ham bu o\'qituvchini o\'chirmoqchimisiz?')) {
      this.teachersService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('O\'qituvchi muvaffaqiyatli o\'chirildi', 'Yopish', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          console.error('Failed to delete teacher:', error);
          this.snackBar.open('O\'chirishda xatolik', 'Yopish', { duration: 3000 });
        }
      });
    }
  }
}
