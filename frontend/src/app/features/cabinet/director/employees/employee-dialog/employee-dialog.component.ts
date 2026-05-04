import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ProfessionsService } from '@core/services/professions.service';
import { EmployeeDto, ProfessionDto } from '@shared/models/common.models';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data ? "Tahrirlash" : "Yangi xodim" }}</h2>
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
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Telefon</mat-label>
          <input matInput formControlName="phone" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Yo'nalish</mat-label>
          <mat-select formControlName="professionId">
            <mat-option [value]="null">-- Tanlanmagan --</mat-option>
            @for (p of professions(); track p.id) {
              <mat-option [value]="p.id">{{ p.name }}</mat-option>
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
export class EmployeeDialogComponent implements OnInit {
  data = inject<EmployeeDto | null>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EmployeeDialogComponent>);
  private profService = inject(ProfessionsService);
  professions = signal<ProfessionDto[]>([]);

  form: FormGroup = this.fb.group({
    fullName: [this.data?.fullName || '', Validators.required],
    username: [{ value: '', disabled: !!this.data }, this.data ? [] : Validators.required],
    password: [{ value: '', disabled: !!this.data }, this.data ? [] : Validators.required],
    email: [this.data?.email || ''],
    phone: [this.data?.phone || ''],
    professionId: [this.data?.professionId || null]
  });

  ngOnInit() {
    this.profService.getAll().subscribe(data => this.professions.set(data));
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}
