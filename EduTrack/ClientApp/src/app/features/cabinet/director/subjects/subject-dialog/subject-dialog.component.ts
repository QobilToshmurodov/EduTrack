import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface SubjectDialogData {
  id?: number;
  name?: string;
  description?: string;
}

@Component({
  selector: 'app-subject-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './subject-dialog.component.html',
  styleUrl: './subject-dialog.component.scss'
})
export class SubjectDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SubjectDialogComponent>);

  subjectForm: FormGroup;
  isEditing: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: SubjectDialogData | null) {
    this.isEditing = !!data?.id;
    this.subjectForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      description: [data?.description || '']
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      this.dialogRef.close(this.subjectForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
