import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class SubjectsService {
  private http = inject(HttpClient);

  getAll(): Observable<SubjectDto[]> {
    return this.http.get<SubjectDto[]>('/subjects');
  }

  getById(id: number): Observable<SubjectDto> {
    return this.http.get<SubjectDto>(`/subjects/${id}`);
  }

  create(payload: Partial<SubjectDto>): Observable<SubjectDto> {
    return this.http.post<SubjectDto>('/subjects', payload);
  }

  update(id: number, payload: Partial<SubjectDto>): Observable<SubjectDto> {
    return this.http.put<SubjectDto>(`/subjects/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/subjects/${id}`);
  }
}