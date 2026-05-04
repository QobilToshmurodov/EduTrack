import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '@core/services/dashboard.service';
import { DashboardStatsDto } from '@shared/models/common.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  loading = signal(true);
  stats = signal<DashboardStatsDto | null>(null);
  today = new Date();

  totalCount = computed(() => {
    const s = this.stats();
    if (!s) return 0;
    return s.professionsCount + s.studentsCount + s.employeesCount +
           s.groupsCount + s.subjectsCount + s.assignmentsCount;
  });

  completionPct = computed(() => {
    const s = this.stats();
    if (!s || s.studentsCount === 0) return 0;
    const ratio = Math.min(s.assignmentsCount / s.studentsCount, 1);
    return Math.round(ratio * 100);
  });

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: data => { this.stats.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
