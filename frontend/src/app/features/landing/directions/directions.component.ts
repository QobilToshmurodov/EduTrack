import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ProfessionsService } from '@core/services/professions.service';
import { ProfessionDto } from '@shared/models/common.models';

@Component({
  selector: 'app-directions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIcon],
  templateUrl: './directions.component.html',
  styleUrl: './directions.component.scss'
})
export class DirectionsComponent implements OnInit {
  private professionsService = inject(ProfessionsService);

  loading = signal(true);
  items = signal<ProfessionDto[]>([]);
  searchQuery = signal('');

  filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.items();
    if (!q) return list;
    return list.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  totalStudents = computed(() =>
    this.items().reduce((sum, p) => sum + (p.groupsCount ?? 0), 0)
  );

  durationCounts = computed(() => {
    const map = new Map<number, number>();
    for (const p of this.items()) {
      map.set(p.durationYears, (map.get(p.durationYears) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([years, count]) => ({ years, count }));
  });

  ngOnInit(): void {
    this.professionsService.getAll().subscribe({
      next: (items) => {
        // Sort: longer programs first, then alphabetic
        const sorted = [...items].sort((a, b) => {
          if (b.durationYears !== a.durationYears) return b.durationYears - a.durationYears;
          return a.name.localeCompare(b.name);
        });
        this.items.set(sorted);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
