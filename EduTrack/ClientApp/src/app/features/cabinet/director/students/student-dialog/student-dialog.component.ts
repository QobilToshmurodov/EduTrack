import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GroupsService } from '@core/services/groups.service';

export interface StudentDialogData {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  groupId?: number;
}

interface Group {
  id: number;
  name: string;
}

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss'
})
export class StudentDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<StudentDialogComponent>);
  private groupsService = inject(GroupsService);

  studentForm: FormGroup;
  isEditing: boolean;
  groups = signal<Group[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: StudentDialogData | null) {
    this.isEditing = !!data?.id;
    this.studentForm = this.fb.group({
      firstName: [data?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [data?.lastName || '', [Validators.required, Validators.minLength(2)]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      groupId: [data?.groupId || null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.groupsService.getAll().subscribe(groups => {
      this.groups.set(groups || []);
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.dialogRef.close(this.studentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
