import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EmployeesService } from '@core/services/employees.service';
import { SubjectsService } from '@core/services/subjects.service';
import { GroupsService } from '@core/services/groups.service';
import { EmployeeDto, SubjectDto, GroupDto } from '@shared/models/common.models';

@Component({
  selector: 'app-esg-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>Fan tayinlash</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Xodim</mat-label>
          <mat-select formControlName="employeeId">
            @for (e of employees(); track e.id) { <mat-option [value]="e.id">{{ e.fullName }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fan</mat-label>
          <mat-select formControlName="subjectId">
            @for (s of subjects(); track s.id) { <mat-option [value]="s.id">{{ s.name }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Guruh</mat-label>
          <mat-select formControlName="groupId">
            @for (g of groups(); track g.id) { <mat-option [value]="g.id">{{ g.name }}</mat-option> }
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
export class ESGDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ESGDialogComponent>);
  private empService = inject(EmployeesService);
  private subService = inject(SubjectsService);
  private grpService = inject(GroupsService);

  employees = signal<EmployeeDto[]>([]);
  subjects = signal<SubjectDto[]>([]);
  groups = signal<GroupDto[]>([]);

  form: FormGroup = this.fb.group({
    employeeId: [null, Validators.required],
    subjectId: [null, Validators.required],
    groupId: [null, Validators.required]
  });

  ngOnInit() {
    this.empService.getAll().subscribe(d => this.employees.set(d));
    this.subService.getAll().subscribe(d => this.subjects.set(d));
    this.grpService.getAll().subscribe(d => this.groups.set(d));
  }

  save() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
