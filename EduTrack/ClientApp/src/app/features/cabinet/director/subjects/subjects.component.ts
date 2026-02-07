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
import { SubjectsService } from '@core/services/subjects.service';
import { NotificationService } from '@core/services/notification.service';
import { SubjectDialogComponent, SubjectDialogData } from './subject-dialog/subject-dialog.component';

interface Subject {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-subjects',
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
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent implements OnInit {
  private subjectsService = inject(SubjectsService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  loading = signal(true);
  subjects = signal<Subject[]>([]);
  displayedColumns = ['id', 'name', 'description', 'actions'];

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.subjectsService.getAll().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load subjects:', error);
        this.notificationService.showError('Ma\'lumotlarni yuklashda xatolik');
        this.loading.set(false);
      }
    });
  }

  openDialog(subject?: Subject): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent, {
      width: '500px',
      data: subject || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (subject) {
          this.updateSubject(subject.id, result);
        } else {
          this.createSubject(result);
        }
      }
    });
  }

  private createSubject(data: any): void {
    this.subjectsService.create(data).subscribe({
      next: () => {
        this.notificationService.showSuccess('Fan muvaffaqiyatli qo\'shildi');
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to create subject:', error);
        this.notificationService.showError('Qo\'shishda xatolik');
      }
    });
  }

  private updateSubject(id: number, data: any): void {
    this.subjectsService.update(id, data).subscribe({
      next: () => {
        this.notificationService.showSuccess('Fan muvaffaqiyatli yangilandi');
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to update subject:', error);
        this.notificationService.showError('Yangilashda xatolik');
      }
    });
  }

  deleteSubject(id: number): void {
    if (confirm('Rostdan ham bu fanni o\'chirmoqchimisiz?')) {
      this.subjectsService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Fan muvaffaqiyatli o\'chirildi');
          this.loadData();
        },
        error: (error) => {
          console.error('Failed to delete subject:', error);
          this.notificationService.showError('O\'chirishda xatolik');
        }
      });
    }
  }
}
