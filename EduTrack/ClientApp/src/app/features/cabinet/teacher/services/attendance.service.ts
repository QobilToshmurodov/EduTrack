import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import {
  AttendanceEventDto,
  AttendanceEvent,
  CreateAttendanceEventDto,
  AttendanceEventType,
  AttendanceSource
} from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);

  // Signal-based state
  private eventsSignal = signal<AttendanceEvent[]>([]);
  events = this.eventsSignal.asReadonly();

  private loadingSignal = signal(false);
  loading = this.loadingSignal.asReadonly();

  getAll(): Observable<AttendanceEvent[]> {
    this.loadingSignal.set(true);
    return this.http.get<AttendanceEventDto[]>('/attendanceevents').pipe(
      map(dtos => dtos.map(dto => this.mapToModel(dto))),
      tap(events => {
        this.eventsSignal.set(events);
        this.loadingSignal.set(false);
      })
    );
  }

  getById(id: number): Observable<AttendanceEvent> {
    return this.http.get<AttendanceEventDto>(`/attendanceevents/${id}`).pipe(
      map(dto => this.mapToModel(dto))
    );
  }

  create(data: CreateAttendanceEventDto): Observable<AttendanceEvent> {
    const payload = {
      ...data,
      timestamp: new Date().toISOString()
    };

    return this.http.post<AttendanceEventDto>('/attendanceevents', payload).pipe(
      map(dto => this.mapToModel(dto)),
      tap(event => {
        this.eventsSignal.update(events => [...events, event]);
      })
    );
  }

  markAttendance(
    studentId: number,
    teacherId: number,
    eventType: AttendanceEventType
  ): Observable<AttendanceEvent> {
    const data: CreateAttendanceEventDto = {
      studentId,
      teacherId,
      eventType,
      source: AttendanceSource.Manual
    };

    return this.create(data);
  }

  private mapToModel(dto: AttendanceEventDto): AttendanceEvent {
    return {
      id: dto.id,
      studentId: dto.studentId,
      teacherId: dto.teacherId,
      timestamp: new Date(dto.timestamp),
      eventType: dto.eventType as AttendanceEventType,
      source: dto.source as AttendanceSource
    };
  }
}
