import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { GroupsService } from '@core/services/groups.service';
import { StudentDto, GroupDto } from '@shared/models/common.models';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data ? "Tahrirlash" : "Yangi o'quvchi" }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>To'liq ism</mat-label>
          <input matInput formControlName="fullName" />
        </mat-form-field>
        @if (!data) {
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Parol</mat-label>
            <input matInput formControlName="password" type="password" />
          </mat-form-field>
        }
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Guruh</mat-label>
          <mat-select formControlName="groupId">
            <mat-option [value]="null">-- Tanlanmagan --</mat-option>
            @for (g of groups(); track g.id) {
              <mat-option [value]="g.id">{{ g.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Bekor qilish</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Saqlash</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class StudentDialogComponent implements OnInit {
  data = inject<StudentDto | null>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<StudentDialogComponent>);
  private groupsService = inject(GroupsService);
  groups = signal<GroupDto[]>([]);

  form: FormGroup = this.fb.group({
    fullName: [this.data?.fullName || '', Validators.required],
    username: [{ value: '', disabled: !!this.data }, this.data ? [] : Validators.required],
    password: [{ value: '', disabled: !!this.data }, this.data ? [] : Validators.required],
    groupId: [this.data?.groupId || null]
  });

  ngOnInit() {
    this.groupsService.getAll().subscribe(data => this.groups.set(data));
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}
