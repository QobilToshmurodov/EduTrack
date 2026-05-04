import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuillEditorComponent } from 'ngx-quill';
import { NewsService } from '@core/services/news.service';
import { NotificationService } from '@core/services/notification.service';
import { NewsDto } from '@shared/models/common.models';

@Component({
  selector: 'app-news-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    QuillEditorComponent
  ],
  templateUrl: './news-dialog.component.html',
  styleUrl: './news-dialog.component.scss'
})
export class NewsDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private newsService = inject(NewsService);
  private notification = inject(NotificationService);
  private dialogRef = inject(MatDialogRef<NewsDialogComponent>);
  data = inject<NewsDto | null>(MAT_DIALOG_DATA);

  form!: FormGroup;
  saving = signal(false);
  uploadingImage = signal(false);
  imagePreview = signal<string>('');

  isEdit = false;

  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.form = this.fb.group({
      title: [this.data?.title ?? '', [Validators.required, Validators.minLength(3)]],
      content: [this.data?.content ?? '', Validators.required],
      imageUrl: [this.data?.imageUrl ?? ''],
      isPublished: [this.data?.isPublished ?? true]
    });

    if (this.data?.imageUrl) {
      this.imagePreview.set(this.newsService.getFullImageUrl(this.data.imageUrl));
    }
  }

  readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/jfif', 'image/webp'];
  readonly maxImageSize = 2 * 1024 * 1024; // 2MB

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!this.allowedImageTypes.includes(file.type)) {
      this.notification.showError('Faqat JPG, PNG, JFIF yoki WEBP formatdagi rasmlar yuklanishi mumkin');
      input.value = '';
      return;
    }
    if (file.size > this.maxImageSize) {
      this.notification.showError('Rasm hajmi 2MB dan oshmasligi kerak');
      input.value = '';
      return;
    }

    this.uploadingImage.set(true);
    this.newsService.uploadImage(file).subscribe({
      next: (res) => {
        this.form.patchValue({ imageUrl: res.imageUrl });
        this.imagePreview.set(this.newsService.getFullImageUrl(res.imageUrl));
        this.uploadingImage.set(false);
        this.notification.showSuccess('Rasm yuklandi');
      },
      error: () => this.uploadingImage.set(false)
    });
  }

  removeImage(): void {
    this.form.patchValue({ imageUrl: '' });
    this.imagePreview.set('');
  }

  submit(): void {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);

    const payload = {
      title: this.form.value.title,
      content: this.form.value.content,
      imageUrl: this.form.value.imageUrl || undefined,
      isPublished: this.form.value.isPublished
    };

    const request$ = this.isEdit
      ? this.newsService.update(this.data!.id, payload)
      : this.newsService.create(payload);

    request$.subscribe({
      next: () => {
        this.notification.showSuccess(this.isEdit ? 'Yangilik yangilandi' : 'Yangilik yaratildi');
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => this.saving.set(false)
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
