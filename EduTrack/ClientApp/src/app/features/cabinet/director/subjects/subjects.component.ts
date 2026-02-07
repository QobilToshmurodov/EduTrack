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
import { SubjectsService } from '@core/services/subjects.service';
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
  private snackBar = inject(MatSnackBar);
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
        this.snackBar.open('Ma\'lumotlarni yuklashda xatolik', 'Yopish', { duration: 3000 });
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
        this.snackBar.open('Fan muvaffaqiyatli qo\'shildi', 'Yopish', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to create subject:', error);
        this.snackBar.open('Qo\'shishda xatolik', 'Yopish', { duration: 3000 });
      }
    });
  }

  private updateSubject(id: number, data: any): void {
    this.subjectsService.update(id, data).subscribe({
      next: () => {
        this.snackBar.open('Fan muvaffaqiyatli yangilandi', 'Yopish', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Failed to update subject:', error);
        this.snackBar.open('Yangilashda xatolik', 'Yopish', { duration: 3000 });
      }
    });
  }

  deleteSubject(id: number): void {
    if (confirm('Rostdan ham bu fanni o\'chirmoqchimisiz?')) {
      this.subjectsService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Fan muvaffaqiyatli o\'chirildi', 'Yopish', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          console.error('Failed to delete subject:', error);
          this.snackBar.open('O\'chirishda xatolik', 'Yopish', { duration: 3000 });
        }
      });
    }
  }
}
