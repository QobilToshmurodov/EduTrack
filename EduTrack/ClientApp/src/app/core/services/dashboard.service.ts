import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStatsDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getStats(): Observable<DashboardStatsDto> {
    return this.http.get<DashboardStatsDto>('/Dashboard/stats');
  }
}
