import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { NewsService } from '@core/services/news.service';
import { NewsDto } from '@shared/models/common.models';

interface Institution {
  name: string;
  location: string;
  type: string;
  cardBg: string;
  tagStyle: string;
  icon: string;
}

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
  private router = inject(Router);

  latestNews = signal<NewsDto[]>([]);
  newsLoading = signal(true);

  institutions: Institution[] = [
    {
      name: "Maktabgacha ta'lim tashkiloti tarbiyachisi",
      location: "2 yil o'qish muddati",
      type: "Pedagogika",
      cardBg: "bg-amber-50 border border-amber-100",
      tagStyle: "bg-amber-50 text-amber-700 border border-amber-200",
      icon: "👶"
    },
    {
      name: "Kutubxonashunoslik",
      location: "2 yil o'qish muddati",
      type: "Axborot xizmati",
      cardBg: "bg-sky-50 border border-sky-100",
      tagStyle: "bg-sky-50 text-sky-700 border border-sky-200",
      icon: "📚"
    },
    {
      name: "Jismoniy tarbiya va sport",
      location: "3 yil o'qish muddati",
      type: "Sport",
      cardBg: "bg-orange-50 border border-orange-100",
      tagStyle: "bg-orange-50 text-orange-700 border border-orange-200",
      icon: "⚽"
    },
    {
      name: "Musiqa rahbari",
      location: "3 yil o'qish muddati",
      type: "San'at",
      cardBg: "bg-violet-50 border border-violet-100",
      tagStyle: "bg-violet-50 text-violet-700 border border-violet-200",
      icon: "🎵"
    },
    {
      name: "Tasviriy san'at",
      location: "3 yil o'qish muddati",
      type: "San'at",
      cardBg: "bg-rose-50 border border-rose-100",
      tagStyle: "bg-rose-50 text-rose-700 border border-rose-200",
      icon: "🎨"
    },
    {
      name: "Axborot texnologiyalari",
      location: "2 yil o'qish muddati",
      type: "IT",
      cardBg: "bg-slate-100 border border-slate-200",
      tagStyle: "bg-slate-100 text-slate-700 border border-slate-200",
      icon: "💻"
    }
  ];

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
