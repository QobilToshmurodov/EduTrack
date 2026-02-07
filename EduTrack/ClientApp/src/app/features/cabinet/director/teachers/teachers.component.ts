import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeachersService } from '@core/services/teachers.service';

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
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private teachersService = inject(TeachersService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  teachers = signal<Teacher[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);

  teacherForm: FormGroup;
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];

  constructor() {
    this.teacherForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

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

  openForm(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.teacherForm.reset();
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.teacherForm.reset();
  }

  editTeacher(teacher: Teacher): void {
    this.editingId.set(teacher.id);
    this.teacherForm.patchValue(teacher);
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const formData = this.teacherForm.value;
      const editingId = this.editingId();

      if (editingId) {
        this.teachersService.update(editingId, formData).subscribe({
          next: () => {
            this.snackBar.open('O\'qituvchi muvaffaqiyatli yangilandi', 'Yopish', { duration: 3000 });
            this.loadData();
            this.closeForm();
          },
          error: (error) => {
            console.error('Failed to update teacher:', error);
            this.snackBar.open('Yangilashda xatolik', 'Yopish', { duration: 3000 });
          }
        });
      } else {
        this.teachersService.create(formData).subscribe({
          next: () => {
            this.snackBar.open('O\'qituvchi muvaffaqiyatli qo\'shildi', 'Yopish', { duration: 3000 });
            this.loadData();
            this.closeForm();
          },
          error: (error) => {
            console.error('Failed to create teacher:', error);
            this.snackBar.open('Qo\'shishda xatolik', 'Yopish', { duration: 3000 });
          }
        });
      }
    }
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
