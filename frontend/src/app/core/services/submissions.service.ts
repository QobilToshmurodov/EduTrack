import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionDto } from '@shared/models/common.models';

@Injectable({ providedIn: 'root' })
export class SubmissionsService {
  private http = inject(HttpClient);
  private base = '/Submissions';

  getAll(): Observable<SubmissionDto[]> {
    return this.http.get<SubmissionDto[]>(this.base);
  }

  getByAssignment(assignmentId: number): Observable<SubmissionDto[]> {
    return this.http.get<SubmissionDto[]>(`${this.base}/by-assignment/${assignmentId}`);
  }

  getByStudent(studentId: number): Observable<SubmissionDto[]> {
    return this.http.get<SubmissionDto[]>(`${this.base}/by-student/${studentId}`);
  }

  submit(assignmentId: number, description?: string, file?: File): Observable<SubmissionDto> {
    const formData = new FormData();
    formData.append('assignmentId', assignmentId.toString());
    if (description) {
      formData.append('description', description);
    }
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<SubmissionDto>(this.base, formData);
  }

  getByEmployee(employeeId: number): Observable<SubmissionDto[]> {
    return this.http.get<SubmissionDto[]>(`${this.base}/by-employee/${employeeId}`);
  }
}
