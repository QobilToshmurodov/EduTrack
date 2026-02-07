import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionDto, CreateSubmissionDto } from '@features/cabinet/student/models/submission.model';

@Injectable({ providedIn: 'root' })
export class SubmissionsService {
  private http = inject(HttpClient);

  getAll(): Observable<SubmissionDto[]> {
    return this.http.get<SubmissionDto[]>('/submissions');
  }

  getById(id: number): Observable<SubmissionDto> {
    return this.http.get<SubmissionDto>(`/submissions/${id}`);
  }

  create(payload: CreateSubmissionDto): Observable<SubmissionDto> {
    return this.http.post<SubmissionDto>('/submissions', payload);
  }

  update(id: number, payload: Partial<SubmissionDto>): Observable<SubmissionDto> {
    return this.http.put<SubmissionDto>(`/submissions/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/submissions/${id}`);
  }
}