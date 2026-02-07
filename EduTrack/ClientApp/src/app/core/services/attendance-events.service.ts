import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceEventDto {
  id: number;
  studentId: number;
  groupId: number;
  subjectId: number;
  teacherId: number;
  date: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AttendanceEventsService {
  private http = inject(HttpClient);

  getAll(): Observable<AttendanceEventDto[]> {
    return this.http.get<AttendanceEventDto[]>('/attendanceevents');
  }

  getById(id: number): Observable<AttendanceEventDto> {
    return this.http.get<AttendanceEventDto>(`/attendanceevents/${id}`);
  }

  create(payload: Partial<AttendanceEventDto>): Observable<AttendanceEventDto> {
    return this.http.post<AttendanceEventDto>('/attendanceevents', payload);
  }

  update(id: number, payload: Partial<AttendanceEventDto>): Observable<AttendanceEventDto> {
    return this.http.put<AttendanceEventDto>(`/attendanceevents/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/attendanceevents/${id}`);
  }
}