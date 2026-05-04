import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewsService } from '@core/services/news.service';
import { NotificationService } from '@core/services/notification.service';
import { NewsDto } from '@shared/models/common.models';
import { NewsDialogComponent } from './news-dialog/news-dialog.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);

  news = signal<NewsDto[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.newsService.getAll().subscribe({
      next: (items) => {
        this.news.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.notification.showError('Yangiliklar yuklanmadi');
        this.loading.set(false);
      }
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(NewsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: null
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  openEdit(item: NewsDto): void {
    const ref = this.dialog.open(NewsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: item
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  delete(item: NewsDto): void {
    if (!confirm(`"${item.title}" yangiligini o'chirmoqchimisiz?`)) return;
    this.newsService.delete(item.id).subscribe({
      next: () => {
        this.notification.showSuccess('Yangilik o\'chirildi');
        this.load();
      },
      error: () => this.notification.showError('O\'chirishda xato yuz berdi')
    });
  }

  getImageUrl(imageUrl: string | undefined): string {
    return this.newsService.getFullImageUrl(imageUrl);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}
