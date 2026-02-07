import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeacherDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class TeachersService {
  private http = inject(HttpClient);

  getAll(): Observable<TeacherDto[]> {
    return this.http.get<TeacherDto[]>('/teachers');
  }

  getById(id: number): Observable<TeacherDto> {
    return this.http.get<TeacherDto>(`/teachers/${id}`);
  }

  create(payload: Partial<TeacherDto>): Observable<TeacherDto> {
    return this.http.post<TeacherDto>('/teachers', payload);
  }

  update(id: number, payload: Partial<TeacherDto>): Observable<TeacherDto> {
    return this.http.put<TeacherDto>(`/teachers/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/teachers/${id}`);
  }
}