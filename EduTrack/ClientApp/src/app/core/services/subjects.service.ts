import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class SubjectsService {
  private http = inject(HttpClient);
  private base = '/Subjects';

  getAll(): Observable<SubjectDto[]> {
    return this.http.get<SubjectDto[]>(this.base);
  }

  getById(id: number): Observable<SubjectDto> {
    return this.http.get<SubjectDto>(`${this.base}/${id}`);
  }

  create(data: { name: string; description?: string }): Observable<SubjectDto> {
    return this.http.post<SubjectDto>(this.base, data);
  }

  update(id: number, data: { name: string; description?: string }): Observable<SubjectDto> {
    return this.http.put<SubjectDto>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
