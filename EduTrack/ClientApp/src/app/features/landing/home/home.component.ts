import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NewsService } from '@core/services/news.service';
import { NewsDto } from '@shared/models/common.models';

interface Institution {
  name: string;
  location: string;
  type: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private newsService = inject(NewsService);
  private router = inject(Router);

  latestNews = signal<NewsDto[]>([]);
  newsLoading = signal(true);

  institutions: Institution[] = [
    {
      name: "Toshkent Sanoat Texnikumi",
      location: "Toshkent shahri",
      type: "Sanoat va texnologiya",
      color: "bg-indigo-100 text-indigo-700",
      icon: "🏭"
    },
    {
      name: "Samarqand Politexnik Texnikumi",
      location: "Samarqand viloyati",
      type: "Politexnik ta'lim",
      color: "bg-emerald-100 text-emerald-700",
      icon: "⚙️"
    },
    {
      name: "Buxoro Agrar Texnikumi",
      location: "Buxoro viloyati",
      type: "Agrar ta'lim",
      color: "bg-green-100 text-green-700",
      icon: "🌾"
    },
    {
      name: "Andijon Tibbiyot Texnikumi",
      location: "Andijon viloyati",
      type: "Tibbiyot ta'limi",
      color: "bg-red-100 text-red-700",
      icon: "⚕️"
    },
    {
      name: "Namangan To'qimachilik Texnikumi",
      location: "Namangan viloyati",
      type: "To'qimachilik sanoati",
      color: "bg-purple-100 text-purple-700",
      icon: "🧵"
    },
    {
      name: "Qo'qon Kimyo Texnikumi",
      location: "Farg'ona viloyati",
      type: "Kimyo sanoati",
      color: "bg-orange-100 text-orange-700",
      icon: "🧪"
    }
  ];

  stats = [
    { label: "Texnikumlar", value: "6+", icon: "🏫" },
    { label: "O'quvchilar", value: "12,000+", icon: "👨‍🎓" },
    { label: "O'qituvchilar", value: "800+", icon: "👨‍🏫" },
    { label: "Yo'nalishlar", value: "45+", icon: "📚" }
  ];

  ngOnInit(): void {
    this.newsService.getLatest(3).subscribe({
      next: (news) => {
        this.latestNews.set(news);
        this.newsLoading.set(false);
      },
      error: () => {
        this.newsLoading.set(false);
      }
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