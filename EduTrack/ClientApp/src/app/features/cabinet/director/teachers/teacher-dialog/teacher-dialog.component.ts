import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface TeacherDialogData {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'app-teacher-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './teacher-dialog.component.html',
  styleUrl: './teacher-dialog.component.scss'
})
export class TeacherDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TeacherDialogComponent>);

  teacherForm: FormGroup;
  isEditing: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: TeacherDialogData | null) {
    this.isEditing = !!data?.id;
    this.teacherForm = this.fb.group({
      firstName: [data?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [data?.lastName || '', [Validators.required, Validators.minLength(2)]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phone: [data?.phone || '']
    });
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      this.dialogRef.close(this.teacherForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
