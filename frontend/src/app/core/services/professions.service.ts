import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfessionDto } from '@shared/models/common.models';

export interface ProfessionWriteDto {
  name: string;
  code: string;
  description?: string;
  durationYears: number;
  iconEmoji?: string;
}

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

  create(data: ProfessionWriteDto): Observable<ProfessionDto> {
    return this.http.post<ProfessionDto>(this.base, data);
  }

  update(id: number, data: ProfessionWriteDto): Observable<ProfessionDto> {
    return this.http.put<ProfessionDto>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
