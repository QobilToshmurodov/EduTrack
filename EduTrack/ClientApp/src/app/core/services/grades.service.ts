import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradeDto, CreateGradeDto } from '@features/cabinet/student/models/submission.model';

@Injectable({ providedIn: 'root' })
export class GradesService {
  private http = inject(HttpClient);

  getAll(): Observable<GradeDto[]> {
    return this.http.get<GradeDto[]>('/grades');
  }

  getById(id: number): Observable<GradeDto> {
    return this.http.get<GradeDto>(`/grades/${id}`);
  }

  create(payload: CreateGradeDto): Observable<GradeDto> {
    return this.http.post<GradeDto>('/grades', payload);
  }

  update(id: number, payload: Partial<GradeDto>): Observable<GradeDto> {
    return this.http.put<GradeDto>(`/grades/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/grades/${id}`);
  }
}