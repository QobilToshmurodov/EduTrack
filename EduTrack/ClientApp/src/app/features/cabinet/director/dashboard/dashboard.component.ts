import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '@core/services/dashboard.service';
import { DashboardStatsDto } from '@shared/models/common.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="dashboard-container">
      <h2>Boshqaruv Paneli</h2>
      @if (loading()) {
        <mat-spinner></mat-spinner>
      } @else if (stats()) {
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-icon>school</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats()!.professionsCount }}</span>
              <span class="stat-label">Yo'nalishlar</span>
            </div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>people</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats()!.studentsCount }}</span>
              <span class="stat-label">O'quvchilar</span>
            </div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>person</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats()!.employeesCount }}</span>
              <span class="stat-label">Xodimlar</span>
            </div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>groups</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats()!.groupsCount }}</span>
              <span class="stat-label">Guruhlar</span>
            </div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>book</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats()!.subjectsCount }}</span>
              <span class="stat-label">Fanlar</span>
            </div>
          </mat-card>
          <mat-card class="stat-card">
            <mat-icon>assignment</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ stats()!.assignmentsCount }}</span>
              <span class="stat-label">Topshiriqlar</span>
            </div>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .stat-card { display: flex; align-items: center; padding: 24px; gap: 16px; }
    .stat-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #1976d2; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 28px; font-weight: bold; }
    .stat-label { color: #666; font-size: 14px; }
  `]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  loading = signal(true);
  stats = signal<DashboardStatsDto | null>(null);

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: data => { this.stats.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
