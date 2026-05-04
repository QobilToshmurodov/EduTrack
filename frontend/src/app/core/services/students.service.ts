import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private http = inject(HttpClient);
  private base = '/Students';

  getAll(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(this.base);
  }

  getById(id: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.base}/${id}`);
  }

  getByUserId(userId: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.base}/by-user/${userId}`);
  }

  create(data: { fullName: string; username: string; password: string; groupId?: number }): Observable<StudentDto> {
    return this.http.post<StudentDto>(this.base, data);
  }

  update(id: number, data: { fullName: string; groupId?: number }): Observable<StudentDto> {
    return this.http.put<StudentDto>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
