import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationLogDto {
  id: number;
  userId: number;
  message: string;
  sentAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationLogsService {
  private http = inject(HttpClient);

  getAll(): Observable<NotificationLogDto[]> {
    return this.http.get<NotificationLogDto[]>('/notificationlogs');
  }

  getById(id: number): Observable<NotificationLogDto> {
    return this.http.get<NotificationLogDto>(`/notificationlogs/${id}`);
  }

  create(payload: Partial<NotificationLogDto>): Observable<NotificationLogDto> {
    return this.http.post<NotificationLogDto>('/notificationlogs', payload);
  }

  update(id: number, payload: Partial<NotificationLogDto>): Observable<NotificationLogDto> {
    return this.http.put<NotificationLogDto>(`/notificationlogs/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/notificationlogs/${id}`);
  }
}