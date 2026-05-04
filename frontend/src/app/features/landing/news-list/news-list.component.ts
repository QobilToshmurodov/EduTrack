import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { NewsService } from '@core/services/news.service';
import { NewsDto } from '@shared/models/common.models';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIcon],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss'
})
export class NewsListComponent implements OnInit {
  private newsService = inject(NewsService);
  private router = inject(Router);

  loading = signal(true);
  items = signal<NewsDto[]>([]);
  searchQuery = signal('');

  publishedItems = computed(() => this.items().filter(n => n.isPublished));

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.publishedItems();
    if (!q) return list;
    return list.filter(n =>
      n.title?.toLowerCase().includes(q) ||
      this.stripHtml(n.content).toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.newsService.getAll().subscribe({
      next: (news) => {
        // Newest first
        const sorted = [...news].sort(
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
        this.items.set(sorted);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getNewsImageUrl(imageUrl: string | undefined): string {
    return this.newsService.getFullImageUrl(imageUrl);
  }

  navigateToNews(id: number): void {
    this.router.navigate(['/news', id]);
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.length > 160 ? text.substring(0, 160) + '...' : text;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
