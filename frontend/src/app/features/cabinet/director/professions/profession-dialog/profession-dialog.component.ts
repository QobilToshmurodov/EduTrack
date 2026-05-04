import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProfessionDto } from '@shared/models/common.models';

@Component({
  selector: 'app-profession-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? "Tahrirlash" : "Yangi yo'nalish" }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nomi</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Kodi</mat-label>
          <input matInput formControlName="code" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tavsif</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
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
export class ProfessionDialogComponent {
  data = inject<ProfessionDto | null>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProfessionDialogComponent>);

  form: FormGroup = this.fb.group({
    name: [this.data?.name || '', Validators.required],
    code: [this.data?.code || '', Validators.required],
    description: [this.data?.description || '']
  });

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
