import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ESGService } from '@core/services/esg.service';
import { AuthService } from '@core/services/auth.service';
import { ESGDto, AssignmentDto } from '@shared/models/common.models';

@Component({
  selector: 'app-assignment-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data ? "Tahrirlash" : "Yangi topshiriq" }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Sarlavha</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tavsif</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fan</mat-label>
          <mat-select formControlName="subjectId">
            @for (e of esgItems(); track e.id) {
              <mat-option [value]="e.subjectId">{{ e.subjectName }} - {{ e.groupName }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Guruh</mat-label>
          <mat-select formControlName="groupId">
            @for (e of esgItems(); track e.id) {
              <mat-option [value]="e.groupId">{{ e.groupName }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Muddat</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate" />
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <div class="file-upload-section">
          <button mat-stroked-button type="button" (click)="fileInput.click()">
            <mat-icon>attach_file</mat-icon> Fayl biriktirish
          </button>
          <input type="file" #fileInput style="display:none" (change)="onFileSelected($event)" />
          @if (selectedFile()) {
            <span class="file-name">{{ selectedFile()!.name }}</span>
            <button mat-icon-button type="button" (click)="removeFile()"><mat-icon>close</mat-icon></button>
          } @else if (data?.filePath) {
            <span class="file-name">Fayl mavjud</span>
          }
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Bekor qilish</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Saqlash</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    .file-upload-section { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
    .file-name { font-size: 14px; color: #555; }
  `]
})
export class AssignmentDialogComponent implements OnInit {
  data = inject<AssignmentDto | null>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AssignmentDialogComponent>);
  private esgService = inject(ESGService);
  private authService = inject(AuthService);
  esgItems = signal<ESGDto[]>([]);
  selectedFile = signal<File | null>(null);

  form: FormGroup = this.fb.group({
    title: [this.data?.title || '', Validators.required],
    description: [this.data?.description || ''],
    subjectId: [this.data?.subjectId || null, Validators.required],
    groupId: [this.data?.groupId || null, Validators.required],
    dueDate: [this.data ? new Date(this.data.dueDate) : null, Validators.required],
    employeeId: [this.data?.employeeId || this.authService.profileId()]
  });

  ngOnInit() {
    const profileId = this.authService.profileId();
    if (profileId) {
      this.esgService.getByEmployee(profileId).subscribe(d => this.esgItems.set(d));
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  save() {
    if (this.form.valid) {
      const val = this.form.value;
      val.dueDate = new Date(val.dueDate).toISOString();
      this.dialogRef.close({ data: val, file: this.selectedFile() });
    }
  }
}
