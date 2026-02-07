import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentsService } from '@core/services/students.service';
import { GroupsService } from '@core/services/groups.service';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  groupId: number;
  groupName?: string;
}

interface Group {
  id: number;
  name: string;
}

@Component({
  selector: 'app-students',
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
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentsService = inject(StudentsService);
  private groupsService = inject(GroupsService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  students = signal<Student[]>([]);
  groups = signal<Group[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);

  studentForm: FormGroup;
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'groupName', 'actions'];

  constructor() {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      groupId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);

    Promise.all([
      this.studentsService.getAll().toPromise(),
      this.groupsService.getAll().toPromise()
    ]).then(([students, groups]) => {
      this.groups.set(groups || []);
      
      const studentsWithGroups = (students || []).map(student => ({
        ...student,
        groupName: groups?.find(g => g.id === student.groupId)?.name || 'N/A'
      })) as unknown as Student[];
      
      this.students.set(studentsWithGroups);
      this.loading.set(false);
    }).catch(error => {
      console.error('Failed to load data:', error);
      this.snackBar.open('Ma\'lumotlarni yuklashda xatolik', 'Yopish', { duration: 3000 });
      this.loading.set(false);
    });
  }

  openForm(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.studentForm.reset();
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.studentForm.reset();
  }

  editStudent(student: Student): void {
    this.editingId.set(student.id);
    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      groupId: student.groupId
    });
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
      const editingId = this.editingId();

      if (editingId) {
        this.studentsService.update(editingId, formData).subscribe({
          next: () => {
            this.snackBar.open('O\'quvchi muvaffaqiyatli yangilandi', 'Yopish', { duration: 3000 });
            this.loadData();
            this.closeForm();
          },
          error: (error) => {
            console.error('Failed to update student:', error);
            this.snackBar.open('Yangilashda xatolik', 'Yopish', { duration: 3000 });
          }
        });
      } else {
        this.studentsService.create(formData).subscribe({
          next: () => {
            this.snackBar.open('O\'quvchi muvaffaqiyatli qo\'shildi', 'Yopish', { duration: 3000 });
            this.loadData();
            this.closeForm();
          },
          error: (error) => {
            console.error('Failed to create student:', error);
            this.snackBar.open('Qo\'shishda xatolik', 'Yopish', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteStudent(id: number): void {
    if (confirm('Rostdan ham bu o\'quvchini o\'chirmoqchimisiz?')) {
      this.studentsService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('O\'quvchi muvaffaqiyatli o\'chirildi', 'Yopish', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          console.error('Failed to delete student:', error);
          this.snackBar.open('O\'chirishda xatolik', 'Yopish', { duration: 3000 });
        }
      });
    }
  }
}
