import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradeDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class GradesService {
  private http = inject(HttpClient);
  private base = '/Grades';

  getAll(): Observable<GradeDto[]> {
    return this.http.get<GradeDto[]>(this.base);
  }

  getById(id: number): Observable<GradeDto> {
    return this.http.get<GradeDto>(`${this.base}/${id}`);
  }

  create(data: { submissionId: number; studentId: number; employeeId: number; value: number; comment?: string }): Observable<GradeDto> {
    return this.http.post<GradeDto>(this.base, data);
  }

  update(id: number, data: { value: number; comment?: string }): Observable<GradeDto> {
    return this.http.put<GradeDto>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
