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
import { GroupsService } from '@core/services/groups.service';

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
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private groupsService = inject(GroupsService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  groups = signal<Group[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);

  groupForm: FormGroup;
  displayedColumns = ['id', 'name', 'description', 'actions'];

  constructor() {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

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
        this.snackBar.open('Ma\'lumotlarni yuklashda xatolik', 'Yopish', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  openForm(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.groupForm.reset();
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.groupForm.reset();
  }

  editGroup(group: Group): void {
    this.editingId.set(group.id);
    this.groupForm.patchValue(group);
    this.showForm.set(true);
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formData = this.groupForm.value;
      const editingId = this.editingId();

      if (editingId) {
        this.groupsService.update(editingId, formData).subscribe({
          next: () => {
            this.snackBar.open('Guruh muvaffaqiyatli yangilandi', 'Yopish', { duration: 3000 });
            this.loadData();
            this.closeForm();
          },
          error: (error) => {
            console.error('Failed to update group:', error);
            this.snackBar.open('Yangilashda xatolik', 'Yopish', { duration: 3000 });
          }
        });
      } else {
        this.groupsService.create(formData).subscribe({
          next: () => {
            this.snackBar.open('Guruh muvaffaqiyatli qo\'shildi', 'Yopish', { duration: 3000 });
            this.loadData();
            this.closeForm();
          },
          error: (error) => {
            console.error('Failed to create group:', error);
            this.snackBar.open('Qo\'shishda xatolik', 'Yopish', { duration: 3000 });
          }
        });
      }
    }
  }

  deleteGroup(id: number): void {
    if (confirm('Rostdan ham bu guruhni o\'chirmoqchimisiz?')) {
      this.groupsService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Guruh muvaffaqiyatli o\'chirildi', 'Yopish', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          console.error('Failed to delete group:', error);
          this.snackBar.open('O\'chirishda xatolik', 'Yopish', { duration: 3000 });
        }
      });
    }
  }
}
