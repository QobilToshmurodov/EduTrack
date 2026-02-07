import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private http = inject(HttpClient);

  getAll(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>('/students');
  }

  getById(id: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`/students/${id}`);
  }

  create(payload: Partial<StudentDto>): Observable<StudentDto> {
    return this.http.post<StudentDto>('/students', payload);
  }

  update(id: number, payload: Partial<StudentDto>): Observable<StudentDto> {
    return this.http.put<StudentDto>(`/students/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/students/${id}`);
  }
}