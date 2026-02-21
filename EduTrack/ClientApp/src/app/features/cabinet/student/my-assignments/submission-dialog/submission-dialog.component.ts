import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentDto } from '@shared/models/common.models';

@Component({
  selector: 'app-submission-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Topshiriq topshirish</h2>
    <mat-dialog-content>
      <p class="assignment-title"><strong>{{ data.title }}</strong></p>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tavsif</mat-label>
          <textarea matInput formControlName="description" rows="4" placeholder="Topshiriq haqida izoh yozing..."></textarea>
        </mat-form-field>
        <div class="file-upload-section">
          <button mat-stroked-button type="button" (click)="fileInput.click()">
            <mat-icon>attach_file</mat-icon> Fayl biriktirish
          </button>
          <input type="file" #fileInput style="display:none" (change)="onFileSelected($event)" />
          @if (selectedFile()) {
            <span class="file-name">{{ selectedFile()!.name }}</span>
            <button mat-icon-button type="button" (click)="removeFile()"><mat-icon>close</mat-icon></button>
          }
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Bekor qilish</button>
      <button mat-raised-button color="primary" (click)="submit()" [disabled]="!isValid()">Topshirish</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    .assignment-title { margin-bottom: 16px; font-size: 16px; }
    .file-upload-section { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .file-name { font-size: 14px; color: #555; }
  `]
})
export class SubmissionDialogComponent {
  data = inject<AssignmentDto>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SubmissionDialogComponent>);
  selectedFile = signal<File | null>(null);

  form: FormGroup = this.fb.group({
    description: ['']
  });

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  isValid(): boolean {
    return !!(this.form.value.description?.trim() || this.selectedFile());
  }

  submit() {
    if (this.isValid()) {
      this.dialogRef.close({
        description: this.form.value.description || '',
        file: this.selectedFile()
      });
    }
  }
}
