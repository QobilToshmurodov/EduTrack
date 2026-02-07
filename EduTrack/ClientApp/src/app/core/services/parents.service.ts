import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParentDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class ParentsService {
  private http = inject(HttpClient);

  getAll(): Observable<ParentDto[]> {
    return this.http.get<ParentDto[]>('/parents');
  }

  getById(id: number): Observable<ParentDto> {
    return this.http.get<ParentDto>(`/parents/${id}`);
  }

  create(payload: Partial<ParentDto>): Observable<ParentDto> {
    return this.http.post<ParentDto>('/parents', payload);
  }

  update(id: number, payload: Partial<ParentDto>): Observable<ParentDto> {
    return this.http.put<ParentDto>(`/parents/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/parents/${id}`);
  }
}