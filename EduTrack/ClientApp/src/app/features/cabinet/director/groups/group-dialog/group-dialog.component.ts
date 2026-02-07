import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface GroupDialogData {
  id?: number;
  name?: string;
  description?: string;
}

@Component({
  selector: 'app-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './group-dialog.component.html',
  styleUrl: './group-dialog.component.scss'
})
export class GroupDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<GroupDialogComponent>);

  groupForm: FormGroup;
  isEditing: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: GroupDialogData | null) {
    this.isEditing = !!data?.id;
    this.groupForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      description: [data?.description || '']
    });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      this.dialogRef.close(this.groupForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
