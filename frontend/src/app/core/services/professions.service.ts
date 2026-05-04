import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfessionDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class ProfessionsService {
  private http = inject(HttpClient);
  private base = '/Professions';

  getAll(): Observable<ProfessionDto[]> {
    return this.http.get<ProfessionDto[]>(this.base);
  }

  getById(id: number): Observable<ProfessionDto> {
    return this.http.get<ProfessionDto>(`${this.base}/${id}`);
  }

  create(data: { name: string; code: string; description?: string }): Observable<ProfessionDto> {
    return this.http.post<ProfessionDto>(this.base, data);
  }

  update(id: number, data: { name: string; code: string; description?: string }): Observable<ProfessionDto> {
    return this.http.put<ProfessionDto>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
