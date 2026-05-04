import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { NewsService } from '@core/services/news.service';
import { ProfessionsService } from '@core/services/professions.service';
import { NewsDto, ProfessionDto } from '@shared/models/common.models';

interface InfrastructureItem {
  icon: string;
  value: string;
  label: string;
}

interface AboutFeature {
  title: string;
  desc: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private newsService = inject(NewsService);
  private professionsService = inject(ProfessionsService);
  private router = inject(Router);

  latestNews = signal<NewsDto[]>([]);
  newsLoading = signal(true);

  professions = signal<ProfessionDto[]>([]);
  professionsLoading = signal(true);

  stats = [
    { label: "O'quvchilar", value: "222+" },
    { label: "O'quv xonalari", value: "19" },
    { label: "Yo'nalishlar", value: "6" },
    { label: "Pedagoglar", value: "5+" }
  ];

  infrastructure: InfrastructureItem[] = [
    { icon: "🏟️", value: "18×36", label: "Sport zali (m)" },
    { icon: "📖", value: "17,000+", label: "Kutubxona kitoblari" },
    { icon: "💺", value: "150", label: "Faollar zali (o'rin)" },
    { icon: "🏠", value: "19 ta", label: "O'quv xonalari" }
  ];

  aboutFeatures: AboutFeature[] = [
    {
      title: "Yuqori malakali pedagoglar",
      desc: "Tajribali va zamonaviy pedagogik metodlarga ega o'qituvchilar jamoasi"
    },
    {
      title: "Amaliyotga asoslangan ta'lim",
      desc: "Nazariya va amaliyotni uyg'unlashtirgan ta'lim dasturlari"
    },
    {
      title: "Zamonaviy infratuzilma",
      desc: "Sport zali, kutubxona, kompyuter xonalari va barcha qulayliklar"
    },
    {
      title: "Kasbiy ko'nikmalar",
      desc: "Talabalarni kelajakdagi kasbiy faoliyatga tayyorlash va yo'naltirish"
    }
  ];

  ngOnInit(): void {
    this.newsService.getLatest(4).subscribe({
      next: (news) => {
        this.latestNews.set(news);
        this.newsLoading.set(false);
      },
      error: () => this.newsLoading.set(false)
    });

    this.professionsService.getAll().subscribe({
      next: (items) => {
        this.professions.set(items);
        this.professionsLoading.set(false);
      },
      error: () => this.professionsLoading.set(false)
    });
  }

  getNewsImageUrl(imageUrl: string | undefined): string {
    return this.newsService.getFullImageUrl(imageUrl);
  }

  navigateToNews(id: number): void {
    this.router.navigate(['/news', id]);
  }

  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').substring(0, 120) + '...';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
