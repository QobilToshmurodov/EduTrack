import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { NewsService } from '@core/services/news.service';
import { NewsDto } from '@shared/models/common.models';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
  // Disable encapsulation so styles for `[innerHTML]` (Quill-generated rich text)
  // are applied. All selectors in the SCSS are scoped under `.lp-news-detail`
  // / `.lp-news-body` to prevent global leakage.
  encapsulation: ViewEncapsulation.None
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private newsService = inject(NewsService);

  news = signal<NewsDto | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/home']);
      return;
    }
    this.newsService.getById(id).subscribe({
      next: (n) => {
        this.news.set(n);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  getFullImageUrl(imageUrl: string | undefined): string {
    return this.newsService.getFullImageUrl(imageUrl);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
