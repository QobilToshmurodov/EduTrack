import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignmentDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class AssignmentsService {
  private http = inject(HttpClient);
  private base = '/Assignments';

  getAll(): Observable<AssignmentDto[]> {
    return this.http.get<AssignmentDto[]>(this.base);
  }

  getById(id: number): Observable<AssignmentDto> {
    return this.http.get<AssignmentDto>(`${this.base}/${id}`);
  }

  getByEmployee(employeeId: number): Observable<AssignmentDto[]> {
    return this.http.get<AssignmentDto[]>(`${this.base}/by-employee/${employeeId}`);
  }

  getByGroup(groupId: number): Observable<AssignmentDto[]> {
    return this.http.get<AssignmentDto[]>(`${this.base}/by-group/${groupId}`);
  }

  create(data: { title: string; description?: string; dueDate: string; subjectId: number; groupId: number; employeeId: number }): Observable<AssignmentDto> {
    return this.http.post<AssignmentDto>(this.base, data);
  }

  update(id: number, data: { title: string; description?: string; dueDate: string; subjectId: number; groupId: number }): Observable<AssignmentDto> {
    return this.http.put<AssignmentDto>(`${this.base}/${id}`, data);
  }

  uploadFile(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.base}/${id}/upload`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
