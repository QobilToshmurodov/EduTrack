import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GroupsService } from '@core/services/groups.service';
import { SubjectsService } from '@core/services/subjects.service';

export interface AssignmentDialogData {
  id?: number;
  title?: string;
  description?: string;
  deadline?: Date;
  groupId?: number;
  subjectId?: number;
}

interface Group {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

@Component({
  selector: 'app-assignment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './assignment-dialog.component.html',
  styleUrl: './assignment-dialog.component.scss'
})
export class AssignmentDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AssignmentDialogComponent>);
  private groupsService = inject(GroupsService);
  private subjectsService = inject(SubjectsService);

  assignmentForm: FormGroup;
  isEditing: boolean;
  groups = signal<Group[]>([]);
  subjects = signal<Subject[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: AssignmentDialogData | null) {
    this.isEditing = !!data?.id;
    this.assignmentForm = this.fb.group({
      title: [data?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.description || ''],
      deadline: [data?.deadline || '', Validators.required],
      groupId: [data?.groupId || null, Validators.required],
      subjectId: [data?.subjectId || null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.groupsService.getAll().subscribe(groups => {
      this.groups.set(groups || []);
    });
    this.subjectsService.getAll().subscribe(subjects => {
      this.subjects.set(subjects || []);
    });
  }

  onSubmit(): void {
    if (this.assignmentForm.valid) {
      this.dialogRef.close(this.assignmentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
